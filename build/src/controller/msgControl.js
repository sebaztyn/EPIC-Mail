"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("dotenv/config");

var _dbConnection = _interopRequireDefault(require("../models/db-connection"));

var _serverResponse = require("../helper/serverResponse");

var _newMessage = _interopRequireDefault(require("../helper/newMessage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var messageControllers = {
  createMessage: function () {
    var _createMessage = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(req, res) {
      var _req$body, message, subject, email, myEmail, myUserId, receiverQuery, _ref, receiverData, receiverId, messageValues, inboxValues, sentValues, _ref2, rows, resultValues;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _req$body = req.body, message = _req$body.message, subject = _req$body.subject, email = _req$body.email;
              myEmail = req.tokenData.email;
              myUserId = req.tokenData.id;
              receiverQuery = {
                text: "SELECT * FROM users WHERE email=$1",
                values: [email]
              };
              _context.next = 7;
              return (0, _dbConnection.default)(receiverQuery);

            case 7:
              _ref = _context.sent;
              receiverData = _ref.rows;
              receiverId = receiverData[0].id;
              messageValues = [message, subject, receiverId, myUserId];
              inboxValues = [receiverId, myEmail, 'unread'];
              sentValues = [myUserId, receiverId, 'sent'];
              _context.next = 15;
              return (0, _newMessage.default)(messageValues, inboxValues, sentValues);

            case 15:
              _ref2 = _context.sent;
              rows = _ref2.rows;
              resultValues = [{
                id: rows[0].message_id,
                subject: rows[0].subject,
                message: rows[0].message,
                createdOn: rows[0].created_on,
                senderId: myEmail
              }];
              return _context.abrupt("return", (0, _serverResponse.serverResponse)(res, 201, 'status', 'data', resultValues));

            case 21:
              _context.prev = 21;
              _context.t0 = _context["catch"](0);
              return _context.abrupt("return", (0, _serverResponse.serverError)(res));

            case 24:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 21]]);
    }));

    function createMessage(_x, _x2) {
      return _createMessage.apply(this, arguments);
    }

    return createMessage;
  }(),
  findUnreadMessages: function () {
    var _findUnreadMessages = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(req, res) {
      var retrievedEmail, userData, userInfo, inboxQuery, inbox, messageId, messageData, _ref3, rows;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              retrievedEmail = req.tokenData.email;
              userData = {
                text: 'SELECT * FROM users WHERE email=$1',
                values: [retrievedEmail]
              };
              _context2.next = 5;
              return (0, _dbConnection.default)(userData);

            case 5:
              userInfo = _context2.sent;
              inboxQuery = {
                text: "SELECT * FROM inbox\n        WHERE receiver_id=$1 AND status=$2",
                values: [userInfo.rows[0].id, 'unread']
              };
              _context2.next = 9;
              return (0, _dbConnection.default)(inboxQuery);

            case 9:
              inbox = _context2.sent;
              messageId = inbox.rows.map(function (each) {
                return each.message_id;
              });
              messageData = {
                text: 'SELECT * FROM messages WHERE message_id=ANY($1)',
                values: [messageId]
              };
              _context2.next = 14;
              return (0, _dbConnection.default)(messageData);

            case 14:
              _ref3 = _context2.sent;
              rows = _ref3.rows;

              if (rows.length) {
                _context2.next = 18;
                break;
              }

              return _context2.abrupt("return", (0, _serverResponse.serverResponse)(res, 200, 'status', 'message', 'You have no unread message'));

            case 18:
              return _context2.abrupt("return", (0, _serverResponse.serverResponse)(res, 200, 'status', 'data', rows));

            case 21:
              _context2.prev = 21;
              _context2.t0 = _context2["catch"](0);
              return _context2.abrupt("return", (0, _serverResponse.serverError)(res));

            case 24:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[0, 21]]);
    }));

    function findUnreadMessages(_x3, _x4) {
      return _findUnreadMessages.apply(this, arguments);
    }

    return findUnreadMessages;
  }(),
  findAllReceivedMessages: function () {
    var _findAllReceivedMessages = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3(req, res) {
      var retrievedEmail, userData, userInfo, usersId, userInboxData, _ref4, rows;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              retrievedEmail = req.tokenData.email;
              userData = {
                text: 'SELECT * FROM users WHERE email=$1',
                values: [retrievedEmail]
              };
              _context3.next = 5;
              return (0, _dbConnection.default)(userData);

            case 5:
              userInfo = _context3.sent;
              usersId = userInfo.rows[0].id;
              userInboxData = {
                text: "SELECT msg.message_id, msg.subject, msg.message, msg.created_on, msg.sender_id, msg.receiver_id, inbox.sender_email, msg.parent_message_id, inbox.status\n         FROM messages AS msg\n         JOIN inbox ON msg.message_id=inbox.message_id\n         WHERE inbox.receiver_id=$1",
                values: [usersId]
              };
              _context3.next = 10;
              return (0, _dbConnection.default)(userInboxData);

            case 10:
              _ref4 = _context3.sent;
              rows = _ref4.rows;

              if (rows.length) {
                _context3.next = 14;
                break;
              }

              return _context3.abrupt("return", (0, _serverResponse.serverResponse)(res, 200, 'status', 'message', 'You have no received message(s)'));

            case 14:
              return _context3.abrupt("return", (0, _serverResponse.serverResponse)(res, 200, 'status', 'data', rows));

            case 17:
              _context3.prev = 17;
              _context3.t0 = _context3["catch"](0);
              return _context3.abrupt("return", (0, _serverResponse.serverError)(res));

            case 20:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[0, 17]]);
    }));

    function findAllReceivedMessages(_x5, _x6) {
      return _findAllReceivedMessages.apply(this, arguments);
    }

    return findAllReceivedMessages;
  }(),
  findSentMessages: function () {
    var _findSentMessages = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4(req, res) {
      var id, sentMessageData, _ref5, rows;

      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              id = req.tokenData.id;
              sentMessageData = {
                text: "SELECT * FROM messages AS msg\n        JOIN sent ON msg.message_id = sent.sent_message_id\n        WHERE sent.sender_id=$1",
                values: [id]
              };
              _context4.next = 5;
              return (0, _dbConnection.default)(sentMessageData);

            case 5:
              _ref5 = _context4.sent;
              rows = _ref5.rows;

              if (rows.length) {
                _context4.next = 9;
                break;
              }

              return _context4.abrupt("return", (0, _serverResponse.serverResponse)(res, 200, 'status', 'message', 'You have no sent message(s)'));

            case 9:
              return _context4.abrupt("return", (0, _serverResponse.serverResponse)(res, 200, 'status', 'data', rows));

            case 12:
              _context4.prev = 12;
              _context4.t0 = _context4["catch"](0);
              return _context4.abrupt("return", (0, _serverResponse.serverError)(res));

            case 15:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, null, [[0, 12]]);
    }));

    function findSentMessages(_x7, _x8) {
      return _findSentMessages.apply(this, arguments);
    }

    return findSentMessages;
  }(),
  getOneInboxMessage: function () {
    var _getOneInboxMessage = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee5(req, res) {
      var messageID, id, inboxQuery, messageData, _ref6, rows;

      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              messageID = Number(req.params.id);
              id = req.tokenData.id;
              _context5.prev = 2;
              inboxQuery = {
                text: "UPDATE inbox\n        SET status = $1\n        WHERE receiver_id=$2 AND message_id=$3",
                values: ['read', id, messageID]
              };
              _context5.next = 6;
              return (0, _dbConnection.default)(inboxQuery);

            case 6:
              messageData = {
                text: "SELECT msg.message_id, msg.subject, msg.message, msg.created_on, msg.sender_id, msg.receiver_id, inbox.sender_email, msg.parent_message_id, inbox.status\n        FROM messages AS msg\n        JOIN inbox ON msg.receiver_id=inbox.receiver_id\n        WHERE msg.message_id=$1 AND msg.receiver_id=$2",
                values: [messageID, id]
              };
              _context5.next = 9;
              return (0, _dbConnection.default)(messageData);

            case 9:
              _ref6 = _context5.sent;
              rows = _ref6.rows;

              if (rows.length) {
                _context5.next = 13;
                break;
              }

              return _context5.abrupt("return", (0, _serverResponse.serverResponse)(res, 404, 'status', 'error', 'Message not found'));

            case 13:
              return _context5.abrupt("return", (0, _serverResponse.serverResponse)(res, 200, 'status', 'data', rows));

            case 16:
              _context5.prev = 16;
              _context5.t0 = _context5["catch"](2);
              return _context5.abrupt("return", (0, _serverResponse.serverError)(res));

            case 19:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, null, [[2, 16]]);
    }));

    function getOneInboxMessage(_x9, _x10) {
      return _getOneInboxMessage.apply(this, arguments);
    }

    return getOneInboxMessage;
  }(),
  getOneSentMessage: function () {
    var _getOneSentMessage = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee6(req, res) {
      var messageID, id, messageData, _ref7, rows;

      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              messageID = Number(req.params.id);
              id = req.tokenData.id;
              _context6.prev = 2;
              messageData = {
                text: "SELECT DISTINCT msg.message_id, msg.subject, msg.message, msg.created_on, msg.sender_id, msg.receiver_id, msg.parent_message_id, sent.status\n        FROM messages AS msg\n        JOIN sent ON msg.sender_id=sent.sender_id\n        WHERE msg.message_id=$1 AND sent.sender_id=$2",
                values: [messageID, id]
              };
              _context6.next = 6;
              return (0, _dbConnection.default)(messageData);

            case 6:
              _ref7 = _context6.sent;
              rows = _ref7.rows;

              if (rows.length) {
                _context6.next = 10;
                break;
              }

              return _context6.abrupt("return", (0, _serverResponse.serverResponse)(res, 404, 'status', 'error', 'Message not found'));

            case 10:
              return _context6.abrupt("return", (0, _serverResponse.serverResponse)(res, 200, 'status', 'data', rows));

            case 13:
              _context6.prev = 13;
              _context6.t0 = _context6["catch"](2);
              return _context6.abrupt("return", (0, _serverResponse.serverError)(res));

            case 16:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, null, [[2, 13]]);
    }));

    function getOneSentMessage(_x11, _x12) {
      return _getOneSentMessage.apply(this, arguments);
    }

    return getOneSentMessage;
  }(),
  deleteInboxMessage: function () {
    var _deleteInboxMessage = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee7(req, res) {
      var messageID, id, messageData, _ref8, rows, inboxToDelete;

      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              messageID = Number(req.params.id);
              id = req.tokenData.id;
              _context7.prev = 2;
              messageData = {
                text: "SELECT * FROM messages\n        WHERE message_id=$1",
                values: [messageID]
              };
              _context7.next = 6;
              return (0, _dbConnection.default)(messageData);

            case 6:
              _ref8 = _context7.sent;
              rows = _ref8.rows;

              if (rows.length) {
                _context7.next = 10;
                break;
              }

              return _context7.abrupt("return", (0, _serverResponse.serverResponse)(res, 404, 'status', 'error', 'Message is missing or has been deleted'));

            case 10:
              inboxToDelete = {
                text: "DELETE FROM inbox\n        WHERE message_id=$1 AND receiver_id=$2",
                values: [messageID, id]
              };
              _context7.next = 13;
              return (0, _dbConnection.default)(inboxToDelete);

            case 13:
              return _context7.abrupt("return", (0, _serverResponse.serverResponse)(res, 200, 'status', 'data', [{
                message: 'Message Deleted'
              }]));

            case 16:
              _context7.prev = 16;
              _context7.t0 = _context7["catch"](2);
              return _context7.abrupt("return", (0, _serverResponse.serverError)(res));

            case 19:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, null, [[2, 16]]);
    }));

    function deleteInboxMessage(_x13, _x14) {
      return _deleteInboxMessage.apply(this, arguments);
    }

    return deleteInboxMessage;
  }(),
  deleteSentMessage: function () {
    var _deleteSentMessage = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee8(req, res) {
      var sentMessageID, sentMessageData, _ref9, rows, sentToDelete;

      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.prev = 0;
              sentMessageID = Number(req.params.sentMessageId);
              sentMessageData = {
                text: "SELECT * FROM sent\n         WHERE sent_id=$1",
                values: [sentMessageID]
              };
              _context8.next = 5;
              return (0, _dbConnection.default)(sentMessageData);

            case 5:
              _ref9 = _context8.sent;
              rows = _ref9.rows;

              if (rows.length) {
                _context8.next = 9;
                break;
              }

              return _context8.abrupt("return", (0, _serverResponse.serverResponse)(res, 404, 'status', 'error', 'Message is missing or has been deleted'));

            case 9:
              sentToDelete = {
                text: "DELETE FROM sent\n         WHERE sent_id=$1",
                values: [sentMessageID]
              };
              _context8.next = 12;
              return (0, _dbConnection.default)(sentToDelete);

            case 12:
              return _context8.abrupt("return", (0, _serverResponse.serverResponse)(res, 200, 'status', 'data', [{
                message: 'Message Deleted'
              }]));

            case 15:
              _context8.prev = 15;
              _context8.t0 = _context8["catch"](0);
              return _context8.abrupt("return", (0, _serverResponse.serverError)(res));

            case 18:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8, null, [[0, 15]]);
    }));

    function deleteSentMessage(_x15, _x16) {
      return _deleteSentMessage.apply(this, arguments);
    }

    return deleteSentMessage;
  }()
};
var _default = messageControllers;
exports.default = _default;