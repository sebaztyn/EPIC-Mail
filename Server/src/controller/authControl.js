import 'dotenv/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dbQuery from '../models/db-connection';
import serverError from '../helper/error';

const authController = {
  async addUser(req, res) {
    try {
      const {
        email, firstName, lastName, username, recoveryEmail
      } = req.body;
      let { password } = req.body;
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
      const query = {
        text: 'SELECT * FROM users WHERE email=$1',
        values: [email]
      };
      const { rows } = await dbQuery(query);
      if (rows.length) {
        return res.status(403).json({
          status: 403,
          error: 'Action Forbidden. Email already exist'
        });
      }
      const insertQuery = {
        text: 'INSERT INTO users (firstName, lastName, email, username, password, recoveryEmail) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        values: [firstName, lastName, email, username, password, recoveryEmail]
      };
      const { rows: newUserDetails } = await dbQuery(insertQuery);
      const token = await jwt.sign({ email, id: newUserDetails[0].id }, process.env.SECRET_KEY);
      return res.header('x-authorization', token).status(201).json({
        status: 201,
        data: [{
          firstName,
          email,
          token
        }]
      });
    } catch (err) {
      return serverError(req, res);
    }
    /* eslint-disable prefer-destructuring */
  },
  async login(req, res) {
    try {
      let { password } = req.body;
      const { email } = req.body;
      const query = {
        text: 'SELECT * FROM users WHERE email=$1',
        values: [email]
      };
      const { rows } = await dbQuery(query);
      if (!rows.length) {
        return res.status(400).json({
          status: 400,
          error: 'Invalid email or Password'
        });
      }
      const checkedPassword = await bcrypt.compare(password, rows[0].password);
      if (!checkedPassword) {
        return res.status(422).json({
          status: 422,
          error: 'Incorrect Password'
        });
      }
      const saltUser = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, saltUser);
      const token = jwt.sign({ email, id: rows[0].id }, process.env.SECRET_KEY);
      return res.header('x-authorization', token).status(200).json({
        status: 200,
        data: [{
          email,
          token
        }]
      });
    } catch (err) {
      return serverError(req, res);
    }
  },
  async passwordreset(req, res) {
    try {
      const { email } = req.body;
      const query = {
        text: 'SELECT * FROM users WHERE email=$1',
        values: [email]
      };
      const { rows } = await dbQuery(query);
      if (!rows.length) {
        return res.status(404).json({
          status: 404,
          error: 'Email does not exist'
        });
      }
      return res.status(201).json({
        status: 201,
        data: [{
          message: 'Check your email for password reset link',
          email: rows[0].email
        }]
      });
    } catch (err) {
      return serverError(req, res);
    }
  }
};

export default authController;
