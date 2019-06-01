"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("dotenv/config");

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _dbConnection = _interopRequireDefault(require("../models/db-connection"));

var _serverResponse = require("../helper/serverResponse");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var authController = {
  addUser: function () {
    var _addUser = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(req, res) {
      var _req$body, email, firstName, lastName, username, recoveryEmail, password, salt, query, _ref, rows, insertQuery, _ref2, newUserDetails, token, displayResult;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _req$body = req.body, email = _req$body.email, firstName = _req$body.firstName, lastName = _req$body.lastName, username = _req$body.username, recoveryEmail = _req$body.recoveryEmail;
              password = req.body.password;
              _context.next = 5;
              return _bcryptjs.default.genSalt(10);

            case 5:
              salt = _context.sent;
              _context.next = 8;
              return _bcryptjs.default.hash(password, salt);

            case 8:
              password = _context.sent;
              query = {
                text: 'SELECT * FROM users WHERE email=$1',
                values: [email]
              };
              _context.next = 12;
              return (0, _dbConnection.default)(query);

            case 12:
              _ref = _context.sent;
              rows = _ref.rows;

              if (!rows.length) {
                _context.next = 16;
                break;
              }

              return _context.abrupt("return", (0, _serverResponse.serverResponse)(res, 403, 'status', 'error', "Action Forbidden. Email already exist"));

            case 16:
              insertQuery = {
                text: 'INSERT INTO users (firstName, lastName, email, username, password, recoveryEmail) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                values: [firstName, lastName, email, username, password, recoveryEmail]
              };
              _context.next = 19;
              return (0, _dbConnection.default)(insertQuery);

            case 19:
              _ref2 = _context.sent;
              newUserDetails = _ref2.rows;
              token = _jsonwebtoken.default.sign({
                email: email,
                id: newUserDetails[0].id
              }, process.env.SECRET_KEY);
              displayResult = [{
                firstname: newUserDetails[0].firstName,
                email: newUserDetails[0].email
              }];
              return _context.abrupt("return", (0, _serverResponse.userResponse)(res, token, 201, displayResult));

            case 26:
              _context.prev = 26;
              _context.t0 = _context["catch"](0);
              return _context.abrupt("return", (0, _serverResponse.serverError)(res));

            case 29:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 26]]);
    }));

    function addUser(_x, _x2) {
      return _addUser.apply(this, arguments);
    }

    return addUser;
  }(),
  login: function () {
    var _login = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(req, res) {
      var password, email, query, _ref3, rows, checkedPassword, saltUser, token, displayResult;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              password = req.body.password;
              email = req.body.email;
              query = {
                text: 'SELECT * FROM users WHERE email=$1',
                values: [email]
              };
              _context2.next = 6;
              return (0, _dbConnection.default)(query);

            case 6:
              _ref3 = _context2.sent;
              rows = _ref3.rows;

              if (rows.length) {
                _context2.next = 10;
                break;
              }

              return _context2.abrupt("return", (0, _serverResponse.serverResponse)(res, 403, 'status', 'error', "Invalid email or Password"));

            case 10:
              _context2.next = 12;
              return _bcryptjs.default.compare(password, rows[0].password);

            case 12:
              checkedPassword = _context2.sent;

              if (checkedPassword) {
                _context2.next = 15;
                break;
              }

              return _context2.abrupt("return", (0, _serverResponse.serverResponse)(res, 422, 'status', 'error', "Incorrect Password"));

            case 15:
              _context2.next = 17;
              return _bcryptjs.default.genSalt(10);

            case 17:
              saltUser = _context2.sent;
              _context2.next = 20;
              return _bcryptjs.default.hash(password, saltUser);

            case 20:
              password = _context2.sent;
              token = _jsonwebtoken.default.sign({
                email: email,
                id: rows[0].id
              }, process.env.SECRET_KEY);
              displayResult = [{
                email: email
              }];
              return _context2.abrupt("return", (0, _serverResponse.userResponse)(res, token, 201, displayResult));

            case 26:
              _context2.prev = 26;
              _context2.t0 = _context2["catch"](0);
              return _context2.abrupt("return", (0, _serverResponse.serverError)(res));

            case 29:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[0, 26]]);
    }));

    function login(_x3, _x4) {
      return _login.apply(this, arguments);
    }

    return login;
  }(),
  passwordreset: function () {
    var _passwordreset = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3(req, res) {
      var email, query, _ref4, rows, token, displayResult;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              email = req.body.email;
              query = {
                text: 'SELECT * FROM users WHERE email=$1',
                values: [email]
              };
              _context3.next = 5;
              return (0, _dbConnection.default)(query);

            case 5:
              _ref4 = _context3.sent;
              rows = _ref4.rows;

              if (rows.length) {
                _context3.next = 9;
                break;
              }

              return _context3.abrupt("return", (0, _serverResponse.serverResponse)(res, 404, 'status', 'error', "Email not found"));

            case 9:
              token = _jsonwebtoken.default.sign({
                email: email,
                id: rows[0].id
              }, process.env.SECRET_KEY);
              displayResult = [{
                message: 'Check your email for password reset link',
                email: rows[0].email
              }];
              return _context3.abrupt("return", (0, _serverResponse.userResponse)(res, token, 201, displayResult));

            case 14:
              _context3.prev = 14;
              _context3.t0 = _context3["catch"](0);
              return _context3.abrupt("return", (0, _serverResponse.serverError)(res));

            case 17:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[0, 14]]);
    }));

    function passwordreset(_x5, _x6) {
      return _passwordreset.apply(this, arguments);
    }

    return passwordreset;
  }()
};
var _default = authController;
exports.default = _default;