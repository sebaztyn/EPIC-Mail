"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("dotenv/config");

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _dbConnection = _interopRequireDefault(require("../models/db-connection"));

var _error = _interopRequireDefault(require("../helper/error"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var authController = {
  addUser: function () {
    var _addUser = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(req, res) {
      var _req$body, email, firstName, lastName, username, recoveryEmail, password, salt, query, _ref, rows, insertQuery, _ref2, newUserDetails, token;

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

              return _context.abrupt("return", res.status(403).json({
                status: 403,
                error: 'Action Forbidden. Email already exist'
              }));

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
              _context.next = 23;
              return _jsonwebtoken.default.sign({
                email: email,
                id: newUserDetails[0].id
              }, process.env.SECRET_KEY);

            case 23:
              token = _context.sent;
              return _context.abrupt("return", res.header('x-authorization', token).status(201).json({
                status: 201,
                data: [{
                  firstName: firstName,
                  email: email,
                  token: token
                }]
              }));

            case 27:
              _context.prev = 27;
              _context.t0 = _context["catch"](0);
              return _context.abrupt("return", (0, _error.default)(req, res));

            case 30:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 27]]);
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
      var password, email, query, _ref3, rows, checkedPassword, saltUser, token;

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

              return _context2.abrupt("return", res.status(400).json({
                status: 400,
                error: 'Invalid email or Password'
              }));

            case 10:
              _context2.next = 12;
              return _bcryptjs.default.compare(password, rows[0].password);

            case 12:
              checkedPassword = _context2.sent;

              if (checkedPassword) {
                _context2.next = 15;
                break;
              }

              return _context2.abrupt("return", res.status(422).json({
                status: 422,
                error: 'Incorrect Password'
              }));

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
              return _context2.abrupt("return", res.header('x-authorization', token).status(200).json({
                status: 200,
                data: [{
                  email: email,
                  token: token
                }]
              }));

            case 25:
              _context2.prev = 25;
              _context2.t0 = _context2["catch"](0);
              return _context2.abrupt("return", (0, _error.default)(req, res));

            case 28:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[0, 25]]);
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
      var email, query, _ref4, rows;

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

              return _context3.abrupt("return", res.status(404).json({
                status: 404,
                error: 'Email does not exist'
              }));

            case 9:
              return _context3.abrupt("return", res.status(201).json({
                status: 201,
                data: [{
                  message: 'Check your email for password reset link',
                  email: rows[0].email
                }]
              }));

            case 12:
              _context3.prev = 12;
              _context3.t0 = _context3["catch"](0);
              return _context3.abrupt("return", (0, _error.default)(req, res));

            case 15:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[0, 12]]);
    }));

    function passwordreset(_x5, _x6) {
      return _passwordreset.apply(this, arguments);
    }

    return passwordreset;
  }()
};
var _default = authController;
exports.default = _default;