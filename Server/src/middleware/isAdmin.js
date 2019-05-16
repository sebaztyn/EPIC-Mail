import dbQuery from '../models/db-connection';
import { serverResponse } from '../helper/serverResponse';

const admin = async (req, res, next) => {
  try {
    const { id } = req.tokenData;
    const { groupId } = req.params;
    const currentUserObj = {
      text: `SELECT * FROM users
      JOIN my_group_members ON users.id = my_group_members.user_id
      WHERE my_group_members.group_id=$1 AND users.id=$2`,
      values: [groupId, id]
    };
    const { rows } = await dbQuery(currentUserObj);
    if (!rows.length) {
      return serverResponse(res, 403, 'status', 'error', 'Task can only be performed by the admin of the Group')
    }
    if (rows[0].user_role !== 'undefined') {
      if (rows[0].user_role === 'admin') return next();
      return serverResponse(res, 403, 'status', 'error', 'Task can only be performed by the admin of the Group')
    }
  } catch (err) {
    return console.log(err.stack);
  }

};

export default admin;
