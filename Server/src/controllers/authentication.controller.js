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

    // validate user inputs (ommission)

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

    // if everything is alright, then hash the password using bcrypt js package from npm

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    // if that is done, then set the password to the hashed password

    password = hash;

    // After that, generate a token for the user using jwt

    const payload = req.body;
    const secret = process.env.SECRET_KEY;
    const token = jwt.sign(payload, secret);

    // then save the user to the database

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
  },
  authorization(req, res) {
    let { password, email } = req.body;
    const allUsers = user.findAllUsers();
    const userCheck = allUsers.find(u => u.email === email);
    if (userCheck.email !== email || userCheck.password !== password) {
      return res.status(400).json({
        status: 400,
        error: 'Invalid email or Password'
      });
    }
    const saltUser = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, saltUser);
    password = hashPassword;

    const token = jwt.sign(req.body, process.env.SECRET_KEY);

    return res.status(200).json({
      status: 200,
      data: [{
        token
      }]
    });
  }
};

export default authenticationController;
