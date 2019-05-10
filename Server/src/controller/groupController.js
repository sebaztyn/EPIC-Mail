import 'dotenv/config';
import dbQuery from '../models/db-connection';
import serverError from '../helper/error';


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
        return res.status(400).json({
          status: 400,
          Error: 'Name already exists. Change your group name please'
        });
      }
      const newGroupData = {
        text: 'INSERT INTO my_group (name,role,admin_id) VALUES ($1, $2,$3) RETURNING * ',
        values: [name, 'admin', adminId]
      };
      const { rows: newGroup } = await dbQuery(newGroupData);
      const firstMember = {
        text: 'INSERT INTO my_group_members (user_id,user_role, group_id) VALUES($1, $2, $3) RETURNING *',
        values: [adminId, 'admin', newGroup[0].id]
      };
      await dbQuery(firstMember);
      return await res.status(201).json({
        status: 201,
        data: [{
          id: newGroup[0].id,
          name: newGroup[0].name,
          role: newGroup[0].role
        }]
      });
    } catch (err) {
      return serverError(req, res);
    }
  },

  async getAllGroupsByAUser(req, res) {
    try {
      const myUserId = req.tokenData.id;
      const myGroups = {
        text: 'SELECT * FROM my_group WHERE admin_id=$1',
        values: [myUserId]
      };
      const groupData = await dbQuery(myGroups);
      return await res.status(200).json({
        status: 200,
        data: [...groupData.rows]
      });
    } catch (err) {
      return serverError(req, res);
    }
  },

  async changeGroupName(req, res) {
    const { groupId } = req.params;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        status: 400,
        Error: "Provide a new group name"
      });
    }

    try {
      const newGroupName = {
        text: 'UPDATE my_group SET name=$1 WHERE id=$2 RETURNING *',
        values: [name, groupId]
      };
      const { rows: changeName } = await dbQuery(newGroupName);
      return res.status(201).json({
        status: 201,
        data: changeName
      });
    } catch (err) {
      return serverError(req, res);
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
        text: 'DELETE FROM my_group WHERE id=$1 AND admin_id=$2 RETURNING *',
        values: [groupId, userId]
      };
      const { rows: groupRow } = await dbQuery(groupToDelete);
      if (!groupRow.length) {
        return res.status(404).json({
          status: 404,
          Error: "Group is missing or has already been deleted"
        });
      }
      return res.status(200).json({
        status: 200,
        data: [{ message: 'Group Deleted' }]
      });
    } catch (err) {
      return serverError(req, res);
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
        return res.status(400).json({
          status: 400,
          error: 'Email is not valid'
        });
      }
      const { id } = rows[0];

      const groupMemberData = {
        text: 'SELECT * FROM my_group_members WHERE user_id=$1 AND group_id=$2',
        values: [id, groupId]
      };
      const { rows: groupMemberInfo } = await dbQuery(groupMemberData);
      if (groupMemberInfo.length) {
        return res.status(400).json({
          status: 400,
          error: 'User is already a member of the group'
        });
      }
      const groupData = {
        text: 'SELECT * FROM my_group WHERE id=$1',
        values: [groupId]
      };
      const { rows: groupRow } = await dbQuery(groupData);
      const { id: groupIdData } = groupRow[0];

      const newUserData = {
        text: 'INSERT INTO my_group_members(user_id,user_role, group_id) VALUES($1, $2, $3) RETURNING *',
        values: [id, 'member', groupIdData]
      };
      const { rows: userRows } = await dbQuery(newUserData);
      return res.status(201).json({
        status: 201,
        data: [
          {
            id: userRows[0].id,
            userId: userRows[0].user_id,
            userRole: userRows[0].user_role
          }
        ]
      });
    } catch (err) {
      return serverError(req, res);
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
        return res.status(404).json({
          status: 404,
          error: 'User not found'
        });
      }
      return res.status(200).json({
        status: 200,
        data: [
          { message: 'User removed successfully' }
        ]
      });
    } catch (err) {
      return serverError(req, res);
    }
  },

  async groupMessage(req, res) {
    try {
      const { groupId } = req.params;
      const { message, subject } = req.body;
      const { email, id } = req.tokenData;
      const groupData = {
        text: 'SELECT * FROM users JOIN my_group_members ON my_group_members.user_id = users.id AND my_group_members.group_id = $1',
        values: [groupId]
      };
      const { rows: groupInfo } = await dbQuery(groupData);
      const emailList = groupInfo.filter(each => each.email !== email);
      let messageResult;
      for (let i = 0; i < emailList.length; i++) {
        const newMessageObj = {
          text: 'INSERT INTO messages (message, subject, receiver_id, sender_id) VALUES ($1, $2, $3, $4) RETURNING * ',
          values: [message, subject, emailList[i].user_id, id]
        };
        const { rows } = await dbQuery(newMessageObj);
        messageResult = rows;

        const inboxObj = {
          text: 'INSERT INTO inbox (message_id, receiver_id, sender_email, status) VALUES ($1, $2, $3, $4)',
          values: [rows[i].message_id, emailList[i].user_id, email, 'unread']
        };
        await dbQuery(inboxObj);

        const sentMessageQuery = {
          text: 'INSERT INTO sent (sent_message_id, sender_id, receiver_id, status) VALUES ($1, $2, $3, $4)',
          values: [rows[i].message_id, id, emailList[i].user_id, 'sent']
        };
        await dbQuery(sentMessageQuery);
      }
      return res.status(201).json({
        status: 201,
        data: [{
          id: messageResult[0].message_id,
          createdOn: messageResult[0].created_on,
          subject: messageResult[0].subject,
          message: messageResult[0].message,
          parentMessageId: messageResult[0].parent_message_id,
          status: 'Sent'
        }]

      });
    } catch (err) {
      return serverError(req, res);
    }
  }
};

export default groupControllers;
