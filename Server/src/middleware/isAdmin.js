import dbQuery from '../models/db-connection';

const admin = async (req, res, next) => {
  try {
    const { email } = req.tokenData;
    const { groupId } = req.params;
    const currentUserObj = {
      text: 'SELECT * FROM users JOIN my_group_members ON users.id = my_group_members.user_id AND my_group_members.group_id=$1',
      values: [groupId]
    };
    const { rows } = await dbQuery(currentUserObj);
    const userObj = rows.filter(each => each.email === email);
    if (userObj[0].user_role === 'admin') return next();
    return res.status(403).json({
      status: 403,
      error: 'Task can only be performed by an Admin'
    });

  } catch (err) {
    return console.log(err.stack);
  }

};

export default admin;
