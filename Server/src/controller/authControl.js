import 'dotenv/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dbQuery from '../models/db-connection';
import { serverError, serverResponse, userResponse } from '../helper/serverResponse';

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
        return serverResponse(res, 403, 'status', 'error', "Action Forbidden. Email already exist");
      }
      const insertQuery = {
        text: 'INSERT INTO users (firstName, lastName, email, username, password, recoveryEmail) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        values: [firstName, lastName, email, username, password, recoveryEmail]
      };
      const { rows: newUserDetails } = await dbQuery(insertQuery);
      const token = jwt.sign({ email, id: newUserDetails[0].id }, process.env.SECRET_KEY);
      const displayResult = [{
        firstname: newUserDetails[0].firstName,
        email: newUserDetails[0].email,
        token
      }];
      return userResponse(res, 201, displayResult);
    } catch (err) {
      return serverError(res, err);
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
        return serverResponse(res, 403, 'status', 'error', "Invalid email or Password");
      }
      const checkedPassword = await bcrypt.compare(password, rows[0].password);
      if (!checkedPassword) {
        return serverResponse(res, 422, 'status', 'error', "Incorrect Password");
      }
      const saltUser = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, saltUser);
      const token = jwt.sign({ email, id: rows[0].id }, process.env.SECRET_KEY);
      const displayResult = [{
        id: rows[0].id,
        email,
        token
      }];
      return userResponse(res, 201, displayResult);
    } catch (err) {
      return serverError(res, err);
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
        return serverResponse(res, 404, 'status', 'error', "Email not found");
      }
      const token = jwt.sign({ email, id: rows[0].id }, process.env.SECRET_KEY); const displayResult = [{
        message: 'Check your email for password reset link',
        email: rows[0].email,
        token
      }];
      return userResponse(res, 201, displayResult);
    } catch (err) {
      return serverError(res, err);
    }
  }
};

export default authController;
