"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dbConnection = _interopRequireDefault(require("../models/db-connection"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var messaging =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(messageArr, inboxArr, sentArr) {
    var messageQuery, _ref2, rows, resultId, inboxQuery, sentMessageQuery;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            messageQuery = {
              text: "INSERT INTO messages (message, subject, receiver_id, sender_id) VALUES ($1, $2, $3, $4) RETURNING * ",
              values: messageArr
            };
            _context.next = 3;
            return (0, _dbConnection.default)(messageQuery);

          case 3:
            _ref2 = _context.sent;
            rows = _ref2.rows;
            resultId = rows[0].message_id;
            inboxQuery = {
              text: "INSERT INTO inbox (message_id, receiver_id, sender_email, status) VALUES ($1, $2, $3, $4)",
              values: [resultId].concat(_toConsumableArray(inboxArr))
            };
            _context.next = 9;
            return (0, _dbConnection.default)(inboxQuery);

          case 9:
            sentMessageQuery = {
              text: "INSERT INTO sent (sent_message_id, sender_id, receiver_id, status) VALUES ($1, $2, $3, $4)",
              values: [resultId].concat(_toConsumableArray(sentArr))
            };
            _context.next = 12;
            return (0, _dbConnection.default)(sentMessageQuery);

          case 12:
            return _context.abrupt("return", {
              rows: rows
            });

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function messaging(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}(); // message = values: [message, subject, receiverId, myUserId]
// inbox = values: [resultId, receiverId, myEmail, 'unread']
// sent = values: [resultId, myUserId, receiverId, 'sent']


var _default = messaging;
exports.default = _default;