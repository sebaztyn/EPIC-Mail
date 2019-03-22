
import { Pool } from 'pg';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
pool.connect();
const authController = {
  async addUser(req, res) {
    const {
      firstName, lastName, username, recoveryEmail
    } = req.body;
    let { password } = req.body;
    let { email } = req.body;
    if (!firstName || !lastName || !password || !recoveryEmail || !username || !email) {
      return res.status(400).json({
        status: 400,
        error: 'All input fields are required'
      });
    }
    email = email.toLowerCase();
    email = email.trim();
    req.body.email = email;

    if (!/^(?=.*\d)(?=.*\[a-z])(?=.*[A-Z])[a-z0-9]{8,}$/i.test(password)) {
      return res.status(400).json({
        status: 400,
        error: 'Password must be at least 5 characters long'
      });
    }
    if (!/^[a-z]+$/i.test(firstName) || !/^[a-z]+$/i.test(lastName) || !/^[a-z0-9]+$/i.test(username)) {
      return res.status(400).json({
        status: 400,
        error: 'Ensure all characters are valid and leave no space(s) within the input'
      });
    }
    try {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      password = hash;

      const payload = req.body;
      const secret = process.env.SECRET_KEY;
      const token = jwt.sign(payload, secret);
      const { rows } = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
      if (!rows.length) {
        await pool.query('INSERT INTO users (firstName, lastName, email, username, password, recoveryEmail) VALUES ($1, $2, $3, $4, $5, $6)', [firstName, lastName, email, username, password, recoveryEmail]);
        return res.status(201).json({
          status: 201,
          data: [{
            firstName,
            email,
            token
          }]
        });
      }
      const userEmail = rows[0].email;
      if (email === userEmail) {
        return res.status(403).json({
          status: 403,
          error: 'Action Forbidden. Email already exist'
        });
      }
    } catch (err) {
      return res.status(400).json({
        status: 400,
        error: 'Ensure all characters are valid and leave no space(s) within the input'
      });
    }
    /* eslint-disable prefer-destructuring */
  },
  async authorization(req, res) {
    let { password, email } = req.body;
    if (!email || !password) return 'Email and Password fields are required';
    email = email.toLowerCase();
    email = email.trim();
    const sql = 'SELECT * FROM users WHERE email=$1';
    const { rows } = await pool.query(sql, [email]);
    if (!rows.length) {
      return res.status(400).json({
        status: 400,
        error: 'Invalid email or Password'
      });
    }
    const checkedPassword = bcrypt.compareSync(password, rows[0].password);
    if (!checkedPassword) {
      return res.status(403).json({
        status: 403,
        error: 'Incorrect Password'
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
        error: 'Email field is required'
      });
    }
    email = email.toLowerCase();
    email = email.trim();
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
      return res.status(400).json({
        status: 400,
        error: 'Email not found'
      });
    }
  }
};

export default authController;
