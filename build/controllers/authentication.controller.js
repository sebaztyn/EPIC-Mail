"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dotenv = _interopRequireDefault(require("dotenv"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _user = _interopRequireDefault(require("../models/user.model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// user authentication
_dotenv.default.config();

var authenticationController = {
  addUser: function addUser(req, res) {
    var _req$body = req.body,
        email = _req$body.email,
        firstName = _req$body.firstName,
        lastName = _req$body.lastName,
        username = _req$body.username,
        recoveryEmail = _req$body.recoveryEmail;
    /* eslint-disable prefer-destructuring */

    var password = req.body.password; // validate user inputs (ommission)

    if (!firstName || !lastName || !password || !recoveryEmail || !username || !email) {
      return res.status(400).json({
        status: 400,
        error: 'All input fields are required'
      });
    } // validate user inputs (whitespace)


    if (!/^[a-z]+$/i.test(firstName) || !/^[a-z]+$/i.test(lastName) || !/^[a-z0-9]+$/i.test(username)) {
      return res.json({
        status: 404,
        error: 'Ensure all characters are valid and leave no space(s) within the input'
      });
    } // if everything is alright, then hash the password using bcrypt js package from npm


    var salt = _bcryptjs.default.genSaltSync(10);

    var hash = _bcryptjs.default.hashSync(password, salt); // if that is done, then set the password to the hashed password


    password = hash; // After that, generate a token for the user using jwt

    var payload = req.body;
    var secret = process.env.SECRET_KEY;

    var token = _jsonwebtoken.default.sign(payload, secret); // then save the user to the database


    var data = _user.default.addUser({
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: password,
      username: username,
      recoveryEmail: recoveryEmail
    });

    return res.status(201).json({
      status: 201,
      data: [{
        token: token,
        data: data
      }]
    });
  },
  authorization: function authorization(req, res) {
    var _req$body2 = req.body,
        password = _req$body2.password,
        email = _req$body2.email;

    var allUsers = _user.default.findAllUsers();

    var userCheck = allUsers.find(function (u) {
      return u.email === email;
    });

    if (userCheck.email !== email || userCheck.password !== password) {
      return res.status(400).json({
        status: 400,
        error: 'Invalid email or Password'
      });
    }

    var saltUser = _bcryptjs.default.genSaltSync(10);

    var hashPassword = _bcryptjs.default.hashSync(password, saltUser);

    password = hashPassword;

    var token = _jsonwebtoken.default.sign(req.body, process.env.SECRET_KEY);

    return res.status(200).json({
      status: 200,
      data: [{
        token: token
      }]
    });
  }
};
var _default = authenticationController;
exports.default = _default;