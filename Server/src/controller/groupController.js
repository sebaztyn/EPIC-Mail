import 'dotenv/config';
import dbQuery from '../models/db-connection';
import { serverError, serverResponse } from '../helper/serverResponse';
import messaging from '../helper/newMessage';


const groupControllers = {
  async createGroup(req, res) {
    const adminId = req.tokenData.id;
    const { name } = req.body;
    try {
      const groupNameData = {
        text: 'SELECT * FROM my_group WHERE name=$1 AND admin_id=$2',
        values: [name, adminId]
      };
      const { rows } = await dbQuery(groupNameData);
      if (rows.length > 0) {
        return serverResponse(res, 400, 'status', 'Error', 'Name already exists. Change your group name please');
      }
      const newGroupData = {
        text: `INSERT INTO my_group (name,admin_id)
         VALUES ($1, $2) RETURNING *`,
        values: [name, adminId]
      };
      const { rows: newGroup } = await dbQuery(newGroupData);
      const firstMember = {
        text: 'INSERT INTO my_group_members (user_id,user_role, group_id) VALUES($1, $2, $3) RETURNING *',
        values: [adminId, 'admin', newGroup[0].group_id]
      };
      await dbQuery(firstMember);
      return serverResponse(res, 201, 'status', 'data', [{
        id: newGroup[0].group_id,
        name: newGroup[0].name
      }]);
    } catch (err) {
      return serverError(res);
    }
  },

  async getAllGroupsByAUser(req, res) {
    try {
      const myUserId = req.tokenData.id;
      const myGroups = {
        text: `SELECT grp.name,grp.group_id,grp.admin_id,members.user_role,members.user_id FROM my_group as grp
         JOIN my_group_members AS members ON grp.group_id=members.group_id
        WHERE members.user_id=$1;`,
        values: [myUserId]
      };
      const { rows } = await dbQuery(myGroups);
      if (!rows.length) return serverResponse(res, 200, 'status', 'message', 'Create or join a Group');
      return serverResponse(res, 200, 'status', 'data', rows);
    } catch (err) {
      return serverError(res);
    }
  },

  async changeGroupName(req, res) {
    const { groupId } = req.params;
    const { name } = req.body;
    try {
      const newGroupName = {
        text: 'UPDATE my_group SET name=$1 WHERE group_id=$2 RETURNING *',
        values: [name, groupId]
      };
      const { rows: changeName } = await dbQuery(newGroupName);
      return serverResponse(res, 201, 'status', 'data', changeName);
    } catch (err) {
      return serverError(res);
    }
  },

  async deleteAgroup(req, res) {
    try {
      const userId = req.tokenData.id;
      const { groupId } = req.params;

      const affectedMembers = {
        text: 'DELETE FROM my_group_members WHERE group_id=$1',
        values: [groupId]
      };
      await dbQuery(affectedMembers);
      const groupToDelete = {
        text: 'DELETE FROM my_group WHERE group_id=$1 AND admin_id=$2 RETURNING *',
        values: [groupId, userId]
      };
      const { rows: groupRow } = await dbQuery(groupToDelete);
      return serverResponse(res, 200, 'status', 'data', [{ message: 'Group Deleted' }]);
    } catch (err) {
      return serverError(res);
    }
  },
  async addUser(req, res) {
    const { groupId } = req.params;
    const { email } = req.body;
    try {
      const userData = {
        text: 'SELECT * FROM users WHERE email=$1',
        values: [email]
      };
      const { rows } = await dbQuery(userData);
      if (!rows.length) {
        return serverResponse(res, 400, 'status', 'Error', 'Email is not valid');
      }
      const { id } = rows[0];

      const groupMemberData = {
        text: 'SELECT * FROM my_group_members WHERE user_id=$1 AND group_id=$2',
        values: [id, groupId]
      };
      const { rows: groupMemberInfo } = await dbQuery(groupMemberData);
      if (groupMemberInfo.length) {
        return serverResponse(res, 400, 'status', 'Error', 'User is already a member of the group');
      }
      const newUserData = {
        text: 'INSERT INTO my_group_members(user_id,user_role, group_id) VALUES($1, $2, $3) RETURNING *',
        values: [id, 'member', groupId]
      };
      const { rows: userRows } = await dbQuery(newUserData);
      const displayResult = [{
        groupId,
        userId: userRows[0].user_id,
        userRole: userRows[0].user_role
      }]
      return serverResponse(res, 201, 'status', 'data', displayResult );
    } catch (err) {
      return serverError(res);
    }
  },
  async deleteUser(req, res) {
    const { groupId, userid: userId } = req.params;
    try {
      const userData = {
        text: 'DELETE FROM my_group_members WHERE user_id=$1 AND group_id=$2 RETURNING *',
        values: [userId, groupId]
      };
      const { rows } = await dbQuery(userData);
      if (!rows.length) {
        return serverResponse(res, 404, 'status', 'error', 'User not found');
      }
      return serverResponse(res, 200, 'status', 'data', [{ message: 'User removed successfully' }]);
    } catch (err) {
      return serverError(res);
    }
  },

  async groupMessage(req, res) {
    try {
      const { groupId } = req.params;
      const { message, subject } = req.body;
      const { email, id } = req.tokenData;
      const groupData = {
        text: `SELECT users.email, my_group_members.user_id FROM users
        JOIN my_group_members ON my_group_members.user_id = users.id WHERE my_group_members.group_id = $1`,
        values: [groupId]
      };
      const { rows: groupInfo } = await dbQuery(groupData);

      const emailList = groupInfo.filter(each => each.email !== email);
      if (!emailList.length) return serverResponse(res, 404, 'status', 'error', 'No other user found');
      const groupMember = emailList.map(async (member) => {
        const messageValues = [message, subject, member.user_id, id];
        const inboxValues = [member.user_id, email, 'unread'];
        const sentValues = [id, member.user_id, 'sent'];
        const { rows } = await messaging(messageValues, inboxValues, sentValues);
        return rows[0];
      });
      const result = await Promise.all(groupMember);
      const displayResult = [{
        id: result[0].message_id,
        createdOn: result[0].created_on,
        subject: result[0].subject,
        message: result[0].message,
        parentMessageId: result[0].parent_message_id,
        status: 'Sent'
      }]

      return serverResponse(res, 201, 'status', 'data', displayResult);
    } catch (err) {
      return serverError(res);
    }
  }
};

export default groupControllers;
