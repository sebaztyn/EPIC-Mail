// user authentication
import { Pool } from 'pg';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


dotenv.config();
const authController = {
  async addUser(req, res) {
    const {
      firstName, lastName, username, recoveryEmail
    } = req.body;
    let { password } = req.body;
    let { email } = req.body;
    email = email.toLowerCase();
    req.body.email = email;
    console.log(email);

    if (!firstName || !lastName || !password || !recoveryEmail || !username || !email) {
      return res.status(400).json({
        status: 400,
        error: 'All input fields are required'
      });
    }

    if (!/^[a-z0-9]{5,}$/i.test(password)) {
      return res.status(404).json({
        status: 404,
        error: 'Password must be at least 5 characters long'
      });
    }

    if (!/^[a-z]+$/i.test(firstName) || !/^[a-z]+$/i.test(lastName) || !/^[a-z0-9]+$/i.test(username)) {
      return res.status(404).json({
        status: 404,
        error: 'Ensure all characters are valid and leave no space(s) within the input'
      });
    }
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL
    });
    await pool.connect();
    console.log('connected to the db');
    try {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      password = hash;
      const payload = req.body;
      const secret = process.env.SECRET_KEY;
      const token = jwt.sign(payload, secret);

      await pool.query('INSERT INTO users (firstName, lastName, email, username, password, recoveryEmail) VALUES ($1, $2, $3, $4, $5, $6)', [firstName, lastName, email, username, password, recoveryEmail]);
      return res.status(201).json({
        status: 201,
        data: [{
          firstName,
          email,
          token
        }]
      });
    } catch (err) {
      return res.status(404).json({
        status: 404,
        error: 'Ensure all characters are valid and leave no space(s) within the input'
      });
    }
    /* eslint-disable prefer-destructuring */
  },
  async authorization(req, res) {
    let { password, email } = req.body;
    email = email.toLowerCase();
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL
    });
    await pool.connect();
    console.log('connected to the db');

    const sql = 'SELECT * FROM users WHERE email=$1 AND password=$2';
    const result = await pool.query(sql, [email, password]);
    console.log(result.rows);
    if (!result.rows.length) {
      return res.status(400).json({
        status: 400,
        error: 'Invalid email or Password'
      });
    }
    try {
      const saltUser = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(password, saltUser);
      password = hashPassword;

      const token = jwt.sign(req.body, process.env.SECRET_KEY);

      return res.status(200).json({
        status: 200,
        data: [{
          email,
          token
        }]
      });
    } catch (err) {
      return res.status(400).json({
        status: 400,
        error: 'Invalid email or Password'
      });
    }
  },
  async passwordreset(req, res) {
    let { email } = req.body;
    if (!email) {
      return res.status(400).json({
        status: 400,
        error: 'Email field are required'
      });
    }
    email = email.toLowerCase();
    email = email.trim();
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL
    });
    await pool.connect();
    console.log('connected to the db');
    const sql = 'SELECT * FROM users WHERE email=$1';
    const result = await pool.query(sql, [email]);
    try {
      if (result.rows[0].email === email) {
        return res.status(201).json({
          status: 201,
          message: 'Check your email for password reset link',
          email: result.rows[0].email
        });
      }
    } catch (err) {
      console.log(`The error message is ${err}`);
      return res.status(400).json({
        status: 400,
        error: 'Email not found'
      });
    }
  }
};

export default authController;
