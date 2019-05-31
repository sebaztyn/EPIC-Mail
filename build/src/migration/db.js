"use strict";

require("@babel/polyfill");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _require = require('pg'),
    Pool = _require.Pool;

var dotenv = require('dotenv');

dotenv.config();
var dbString = process.env.DATABASE_URL;
if (process.env.NODE_ENV === 'test') dbString = process.env.DATABASE_TEST;
if (process.env.NODE_ENV === 'production') dbString = process.env.DATABASE_PRODUCTION;
var pool = new Pool({
  connectionString: dbString
});

var dropTables =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var userTables, messageTable, inboxTable, sentTable, groupTable, groupMemberTable;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            userTables = "DROP TABLE IF EXISTS users CASCADE";
            messageTable = "DROP TABLE IF EXISTS messages CASCADE";
            inboxTable = "DROP TABLE IF EXISTS inbox CASCADE";
            sentTable = "DROP TABLE IF EXISTS sent CASCADE";
            groupTable = "DROP TABLE IF EXISTS my_group CASCADE";
            groupMemberTable = "DROP TABLE IF EXISTS my_group_members CASCADE";
            _context.prev = 6;
            _context.next = 9;
            return pool.query(userTables);

          case 9:
            _context.next = 11;
            return pool.query(messageTable);

          case 11:
            _context.next = 13;
            return pool.query(inboxTable);

          case 13:
            _context.next = 15;
            return pool.query(sentTable);

          case 15:
            _context.next = 17;
            return pool.query(groupTable);

          case 17:
            _context.next = 19;
            return pool.query(groupMemberTable);

          case 19:
            _context.next = 23;
            break;

          case 21:
            _context.prev = 21;
            _context.t0 = _context["catch"](6);

          case 23:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[6, 21]]);
  }));

  return function dropTables() {
    return _ref.apply(this, arguments);
  };
}();

var createTables =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2() {
    var usersTable, messagesTable, inboxTable, sentTable, myGroupTable, myGroupMembersTable;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            usersTable = "CREATE TABLE users(\n      id BIGSERIAL PRIMARY KEY NOT NULL,\n      firstname VARCHAR(45) NOT NULL,\n      lastname VARCHAR(45) NOT NULL,\n      email VARCHAR(128) NOT NULL UNIQUE,\n      username VARCHAR(30) NOT NULL,\n      password VARCHAR(128) NOT NULL,\n      recoveryEmail VARCHAR(128) NOT NULL\n      );";
            messagesTable = "CREATE TABLE messages(\n     message_id BIGSERIAL PRIMARY KEY NOT NULL,\n      message TEXT,\n      subject TEXT,\n      created_on TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,\n      sender_id INTEGER REFERENCES users(id) NOT NULL,\n      receiver_id INTEGER REFERENCES users(id) NOT NULL,\n      parent_message_id INTEGER\n    );";
            inboxTable = "CREATE TABLE inbox(\n      inbox_id BIGSERIAL PRIMARY KEY NOT NULL,\n      sender_email VARCHAR(128) REFERENCES users(email) NOT NULL,\n      message_id INTEGER REFERENCES messages(message_id) NOT NULL,\n      receiver_id INTEGER REFERENCES users(id) NOT NULL,\n      status VARCHAR(20) NOT NULL\n    );";
            sentTable = "CREATE TABLE sent(\n      sent_id BIGSERIAL PRIMARY KEY NOT NULL,\n      sent_message_id INTEGER REFERENCES messages(message_id) NOT NULL,\n      sender_id INTEGER REFERENCES users(id) NOT NULL,\n      receiver_id INTEGER REFERENCES users(id) NOT NULL,\n      status VARCHAR(20) NOT NULL\n    );";
            myGroupTable = "CREATE TABLE my_group(\n      group_id SERIAL PRIMARY KEY NOT NULL,\n      name VARCHAR(60),\n      admin_id INT REFERENCES users(id) NOT NULL\n    );";
            myGroupMembersTable = "CREATE TABLE my_group_members(\n      user_id INTEGER REFERENCES users(id) NOT NULL,\n      group_id INTEGER REFERENCES my_group(group_id) NOT NULL,\n      user_role VARCHAR(20)\n    );";
            _context2.prev = 6;
            _context2.next = 9;
            return pool.query(usersTable);

          case 9:
            _context2.next = 11;
            return pool.query(messagesTable);

          case 11:
            _context2.next = 13;
            return pool.query(inboxTable);

          case 13:
            _context2.next = 15;
            return pool.query(sentTable);

          case 15:
            _context2.next = 17;
            return pool.query(myGroupTable);

          case 17:
            _context2.next = 19;
            return pool.query(myGroupMembersTable);

          case 19:
            _context2.next = 21;
            return console.log(err, 'database creation error');

          case 21:
            _context2.next = 26;
            break;

          case 23:
            _context2.prev = 23;
            _context2.t0 = _context2["catch"](6);
            console.log(_context2.t0, 'database creation error');

          case 26:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[6, 23]]);
  }));

  return function createTables() {
    return _ref2.apply(this, arguments);
  };
}();

var callTables =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3() {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return dropTables();

          case 2:
            _context3.next = 4;
            return createTables();

          case 4:
            _context3.next = 6;
            return console.log('database functions called successfully');

          case 6:
            _context3.next = 8;
            return process.exit(0);

          case 8:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function callTables() {
    return _ref3.apply(this, arguments);
  };
}();

callTables();