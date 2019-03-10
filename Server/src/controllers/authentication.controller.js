// user authentication
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import user from '../models/user.model';


dotenv.config();
const authenticationController = {
  addUser(req, res) {
    const {
      email, firstName, lastName, username, recoveryEmail
    } = req.body;

    /* eslint-disable prefer-destructuring */
    let password = req.body.password;

    if (!firstName || !lastName || !password || !recoveryEmail || !username || !email) {
      return res.status(400).json({
        status: 400,
        error: 'All input fields are required'
      });
    }
    // validate user inputs (whitespace)
    if (!/^[a-z]+$/i.test(firstName) || !/^[a-z]+$/i.test(lastName) || !/^[a-z0-9]+$/i.test(username)) {
      return res.json({
        status: 404,
        error: 'Ensure all characters are valid and leave no space(s) within the input'
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    password = hash;

    const payload = req.body;
    const secret = process.env.SECRET_KEY;
    const token = jwt.sign(payload, secret);

    const data = user.addUser({
      email, firstName, lastName, password, username, recoveryEmail
    });

    return res.status(201).json({
      status: 201,
      data: [{
        token,
        data
      }]
    });
  }
};
export default authenticationController;
