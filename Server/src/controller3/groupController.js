import { Pool } from 'pg';
import dotenv from 'dotenv';


dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
pool.connect();
console.log('connected to the db');

const groupControllers = {
  async createGroup(req, res) {
    let { name } = req.body;
    name = name.toLowerCase();
    req.body.name = name;
    try {
      const namesSql = 'SELECT * FROM my_group WHERE name=$1';
      const nameDetails = await pool.query(namesSql, [name]);
      if (nameDetails.rows[0]) {
        return res.status(400).json({
          status: 400,
          Error: 'Name already exists. Change your group name please'
        });
      }
      const groupSql = 'INSERT INTO my_group (name,role) VALUES ($1, $2) RETURNING * ';
      const groupResult = await pool.query(groupSql, [name, 'admin']);
      return res.status(201).json({
        status: 201,
        data: [{
          id: groupResult.rows[0].id,
          name: groupResult.rows[0].name,
          role: groupResult.rows[0].role
        }]
      });
    } catch (err) {
      return res.status(400).json({
        status: 400,
        Error: 'Check your credential and try again'
      });
    }
  },

  async getAllGroups(req, res) {
    try {
      const groupSql = 'SELECT * FROM my_group';
      const groupDetails = await pool.query(groupSql);
      return res.status(200).json({
        status: 200,
        data: [...groupDetails.rows]
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        Error: "Try again Later"
      });
    }
  },

  async changeGroupName(req, res) {
    let { name } = req.params;
    const id = Number(req.params.id);

    name = name.toLowerCase();
    name = name.trim();
    req.params.name = name;
    try {
      const groupSql = 'SELECT * FROM my_group WHERE id=$1';
      await pool.query(groupSql, [id]);
      const changeNameSql = 'UPDATE my_group SET name=$1 WHERE id=$2 returning *';
      const { rows: changeName } = await pool.query(changeNameSql, [name, id]);
      return res.status(201).json({
        status: 201,
        data: changeName
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        error: 'Try again later'
      });
    }
  },
  async deleteAgroup(req, res) {
    try {
      const id = Number(req.params.id);
      const deleteSql = 'DELETE FROM my_group WHERE id=$1';
      const { rows: groupRow } = await pool.query(deleteSql, [id]);
      if (!groupRow) {
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
      return res.status(404).json({
        status: 404,
        Error: "Group not found or it has been deleted"
      });
    }
  },
  async addUser(req, res) {
    try {
      const { email, role } = req.body;
      const userSql = 'SELECT * FROM users WHERE email=$1';
      const { rows } = await pool.query(userSql, [email]);
      console.log(rows);
      const id = rows[0].id;
      const userDetailsSql = 'INSERT INTO my_group_members(user_id,user_role) VALUES($1, $2) RETURNING *';
      const { rows: userRows } = await pool.query(userDetailsSql, [id, role]);
      return res.status(201).json({
        status: 201,
        data: [userRows]
      });
    } catch (err) {
      return res.status(404).json({
        status: 404,
        error: 'input fields are required'
      });
    }
  }
};

export default groupControllers;
