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
    var email, groupId, currentUserObj, _ref2, rows, userObj;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            email = req.tokenData.email;
            groupId = req.params.groupId;
            currentUserObj = {
              text: 'SELECT * FROM users JOIN my_group_members ON users.id = my_group_members.user_id AND my_group_members.group_id=$1',
              values: [groupId]
            };
            _context.next = 6;
            return (0, _dbConnection.default)(currentUserObj);

          case 6:
            _ref2 = _context.sent;
            rows = _ref2.rows;
            userObj = rows.filter(function (each) {
              return each.email === email;
            });

            if (!(userObj[0].user_role === 'admin')) {
              _context.next = 11;
              break;
            }

            return _context.abrupt("return", next());

          case 11:
            return _context.abrupt("return", res.status(403).json({
              status: 403,
              error: 'Task can only be performed by an Admin'
            }));

          case 14:
            _context.prev = 14;
            _context.t0 = _context["catch"](0);
            return _context.abrupt("return", console.log(_context.t0.stack));

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 14]]);
  }));

  return function admin(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var _default = admin;
exports.default = _default;