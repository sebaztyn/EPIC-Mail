"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dbConnection = _interopRequireDefault(require("../models/db-connection"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var admin =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res, next) {
    var id, groupId, currentUserObj, _ref2, rows;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            id = req.tokenData.id;
            groupId = req.params.groupId;
            currentUserObj = {
              text: "SELECT * FROM users\n      JOIN my_group_members ON users.id = my_group_members.user_id\n      WHERE my_group_members.group_id=$1 AND users.id=$2",
              values: [groupId, id]
            };
            _context.next = 6;
            return (0, _dbConnection.default)(currentUserObj);

          case 6:
            _ref2 = _context.sent;
            rows = _ref2.rows;

            if (rows.length) {
              _context.next = 10;
              break;
            }

            return _context.abrupt("return", res.status(403).json({
              status: 403,
              error: 'Task can only be performed by the admin of the Group'
            }));

          case 10:
            if (!(rows[0].user_role !== 'undefined')) {
              _context.next = 14;
              break;
            }

            if (!(rows[0].user_role === 'admin')) {
              _context.next = 13;
              break;
            }

            return _context.abrupt("return", next());

          case 13:
            return _context.abrupt("return", res.status(403).json({
              status: 403,
              error: 'Task can only be performed by the admin of the Group'
            }));

          case 14:
            _context.next = 19;
            break;

          case 16:
            _context.prev = 16;
            _context.t0 = _context["catch"](0);
            return _context.abrupt("return", console.log(_context.t0.stack));

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 16]]);
  }));

  return function admin(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var _default = admin;
exports.default = _default;