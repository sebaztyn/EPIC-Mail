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

var groupControllers = {
  createGroup: function () {
    var _createGroup = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(req, res) {
      var adminId, name, groupNameData, _ref, rows, newGroupData, _ref2, newGroup, firstMember;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              adminId = req.tokenData.id;
              name = req.body.name;
              _context.prev = 2;
              groupNameData = {
                text: 'SELECT * FROM my_group WHERE name=$1 AND admin_id=$2',
                values: [name, adminId]
              };
              _context.next = 6;
              return (0, _dbConnection.default)(groupNameData);

            case 6:
              _ref = _context.sent;
              rows = _ref.rows;

              if (!(rows.length > 0)) {
                _context.next = 10;
                break;
              }

              return _context.abrupt("return", (0, _serverResponse.serverResponse)(res, 400, 'status', 'Error', 'Name already exists. Change your group name please'));

            case 10:
              newGroupData = {
                text: "INSERT INTO my_group (name,admin_id)\n         VALUES ($1, $2) RETURNING *",
                values: [name, adminId]
              };
              _context.next = 13;
              return (0, _dbConnection.default)(newGroupData);

            case 13:
              _ref2 = _context.sent;
              newGroup = _ref2.rows;
              firstMember = {
                text: 'INSERT INTO my_group_members (user_id,user_role, group_id) VALUES($1, $2, $3) RETURNING *',
                values: [adminId, 'admin', newGroup[0].group_id]
              };
              _context.next = 18;
              return (0, _dbConnection.default)(firstMember);

            case 18:
              return _context.abrupt("return", (0, _serverResponse.serverResponse)(res, 201, 'status', 'data', [{
                id: newGroup[0].group_id,
                name: newGroup[0].name
              }]));

            case 21:
              _context.prev = 21;
              _context.t0 = _context["catch"](2);
              return _context.abrupt("return", (0, _serverResponse.serverError)(res));

            case 24:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[2, 21]]);
    }));

    function createGroup(_x, _x2) {
      return _createGroup.apply(this, arguments);
    }

    return createGroup;
  }(),
  getAllGroupsByAUser: function () {
    var _getAllGroupsByAUser = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(req, res) {
      var myUserId, myGroups, _ref3, rows;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              myUserId = req.tokenData.id;
              myGroups = {
                text: "SELECT grp.name,grp.group_id,grp.admin_id,members.user_role,members.user_id FROM my_group as grp\n         JOIN my_group_members AS members ON grp.group_id=members.group_id\n        WHERE members.user_id=$1;",
                values: [myUserId]
              };
              _context2.next = 5;
              return (0, _dbConnection.default)(myGroups);

            case 5:
              _ref3 = _context2.sent;
              rows = _ref3.rows;

              if (rows.length) {
                _context2.next = 9;
                break;
              }

              return _context2.abrupt("return", (0, _serverResponse.serverResponse)(res, 200, 'status', 'message', 'Create or join a Group'));

            case 9:
              return _context2.abrupt("return", (0, _serverResponse.serverResponse)(res, 200, 'status', 'data', rows));

            case 12:
              _context2.prev = 12;
              _context2.t0 = _context2["catch"](0);
              return _context2.abrupt("return", (0, _serverResponse.serverError)(res));

            case 15:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[0, 12]]);
    }));

    function getAllGroupsByAUser(_x3, _x4) {
      return _getAllGroupsByAUser.apply(this, arguments);
    }

    return getAllGroupsByAUser;
  }(),
  changeGroupName: function () {
    var _changeGroupName = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3(req, res) {
      var groupId, name, newGroupName, _ref4, changeName;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              groupId = req.params.groupId;
              name = req.body.name;
              _context3.prev = 2;
              newGroupName = {
                text: 'UPDATE my_group SET name=$1 WHERE group_id=$2 RETURNING *',
                values: [name, groupId]
              };
              _context3.next = 6;
              return (0, _dbConnection.default)(newGroupName);

            case 6:
              _ref4 = _context3.sent;
              changeName = _ref4.rows;
              return _context3.abrupt("return", (0, _serverResponse.serverResponse)(res, 201, 'status', 'data', changeName));

            case 11:
              _context3.prev = 11;
              _context3.t0 = _context3["catch"](2);
              return _context3.abrupt("return", (0, _serverResponse.serverError)(res));

            case 14:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[2, 11]]);
    }));

    function changeGroupName(_x5, _x6) {
      return _changeGroupName.apply(this, arguments);
    }

    return changeGroupName;
  }(),
  deleteAgroup: function () {
    var _deleteAgroup = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4(req, res) {
      var userId, groupId, affectedMembers, groupToDelete, _ref5, groupRow;

      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              userId = req.tokenData.id;
              groupId = req.params.groupId;
              affectedMembers = {
                text: 'DELETE FROM my_group_members WHERE group_id=$1',
                values: [groupId]
              };
              _context4.next = 6;
              return (0, _dbConnection.default)(affectedMembers);

            case 6:
              groupToDelete = {
                text: 'DELETE FROM my_group WHERE group_id=$1 AND admin_id=$2 RETURNING *',
                values: [groupId, userId]
              };
              _context4.next = 9;
              return (0, _dbConnection.default)(groupToDelete);

            case 9:
              _ref5 = _context4.sent;
              groupRow = _ref5.rows;
              return _context4.abrupt("return", (0, _serverResponse.serverResponse)(res, 200, 'status', 'data', [{
                message: 'Group Deleted'
              }]));

            case 14:
              _context4.prev = 14;
              _context4.t0 = _context4["catch"](0);
              return _context4.abrupt("return", (0, _serverResponse.serverError)(res));

            case 17:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, null, [[0, 14]]);
    }));

    function deleteAgroup(_x7, _x8) {
      return _deleteAgroup.apply(this, arguments);
    }

    return deleteAgroup;
  }(),
  addUser: function () {
    var _addUser = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee5(req, res) {
      var groupId, email, userData, _ref6, rows, id, groupMemberData, _ref7, groupMemberInfo, newUserData, _ref8, userRows, displayResult;

      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              groupId = req.params.groupId;
              email = req.body.email;
              _context5.prev = 2;
              userData = {
                text: 'SELECT * FROM users WHERE email=$1',
                values: [email]
              };
              _context5.next = 6;
              return (0, _dbConnection.default)(userData);

            case 6:
              _ref6 = _context5.sent;
              rows = _ref6.rows;

              if (rows.length) {
                _context5.next = 10;
                break;
              }

              return _context5.abrupt("return", (0, _serverResponse.serverResponse)(res, 400, 'status', 'Error', 'Email is not valid'));

            case 10:
              id = rows[0].id;
              groupMemberData = {
                text: 'SELECT * FROM my_group_members WHERE user_id=$1 AND group_id=$2',
                values: [id, groupId]
              };
              _context5.next = 14;
              return (0, _dbConnection.default)(groupMemberData);

            case 14:
              _ref7 = _context5.sent;
              groupMemberInfo = _ref7.rows;

              if (!groupMemberInfo.length) {
                _context5.next = 18;
                break;
              }

              return _context5.abrupt("return", (0, _serverResponse.serverResponse)(res, 400, 'status', 'Error', 'User is already a member of the group'));

            case 18:
              newUserData = {
                text: 'INSERT INTO my_group_members(user_id,user_role, group_id) VALUES($1, $2, $3) RETURNING *',
                values: [id, 'member', groupId]
              };
              _context5.next = 21;
              return (0, _dbConnection.default)(newUserData);

            case 21:
              _ref8 = _context5.sent;
              userRows = _ref8.rows;
              displayResult = [{
                groupId: groupId,
                userId: userRows[0].user_id,
                userRole: userRows[0].user_role
              }];
              return _context5.abrupt("return", (0, _serverResponse.serverResponse)(res, 201, 'status', 'data', displayResult));

            case 27:
              _context5.prev = 27;
              _context5.t0 = _context5["catch"](2);
              return _context5.abrupt("return", (0, _serverResponse.serverError)(res));

            case 30:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, null, [[2, 27]]);
    }));

    function addUser(_x9, _x10) {
      return _addUser.apply(this, arguments);
    }

    return addUser;
  }(),
  deleteUser: function () {
    var _deleteUser = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee6(req, res) {
      var _req$params, groupId, userId, userData, _ref9, rows;

      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _req$params = req.params, groupId = _req$params.groupId, userId = _req$params.userid;
              _context6.prev = 1;
              userData = {
                text: 'DELETE FROM my_group_members WHERE user_id=$1 AND group_id=$2 RETURNING *',
                values: [userId, groupId]
              };
              _context6.next = 5;
              return (0, _dbConnection.default)(userData);

            case 5:
              _ref9 = _context6.sent;
              rows = _ref9.rows;

              if (rows.length) {
                _context6.next = 9;
                break;
              }

              return _context6.abrupt("return", (0, _serverResponse.serverResponse)(res, 404, 'status', 'error', 'User not found'));

            case 9:
              return _context6.abrupt("return", (0, _serverResponse.serverResponse)(res, 200, 'status', 'data', [{
                message: 'User removed successfully'
              }]));

            case 12:
              _context6.prev = 12;
              _context6.t0 = _context6["catch"](1);
              return _context6.abrupt("return", (0, _serverResponse.serverError)(res));

            case 15:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, null, [[1, 12]]);
    }));

    function deleteUser(_x11, _x12) {
      return _deleteUser.apply(this, arguments);
    }

    return deleteUser;
  }(),
  groupMessage: function () {
    var _groupMessage = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee8(req, res) {
      var groupId, _req$body, message, subject, _req$tokenData, email, id, groupData, _ref10, groupInfo, emailList, groupMember, result, displayResult;

      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.prev = 0;
              groupId = req.params.groupId;
              _req$body = req.body, message = _req$body.message, subject = _req$body.subject;
              _req$tokenData = req.tokenData, email = _req$tokenData.email, id = _req$tokenData.id;
              groupData = {
                text: "SELECT users.email, my_group_members.user_id FROM users\n        JOIN my_group_members ON my_group_members.user_id = users.id WHERE my_group_members.group_id = $1",
                values: [groupId]
              };
              _context8.next = 7;
              return (0, _dbConnection.default)(groupData);

            case 7:
              _ref10 = _context8.sent;
              groupInfo = _ref10.rows;
              emailList = groupInfo.filter(function (each) {
                return each.email !== email;
              });

              if (emailList.length) {
                _context8.next = 12;
                break;
              }

              return _context8.abrupt("return", (0, _serverResponse.serverResponse)(res, 404, 'status', 'error', 'No other user found'));

            case 12:
              groupMember = emailList.map(
              /*#__PURE__*/
              function () {
                var _ref11 = _asyncToGenerator(
                /*#__PURE__*/
                regeneratorRuntime.mark(function _callee7(member) {
                  var messageValues, inboxValues, sentValues, _ref12, rows;

                  return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                      switch (_context7.prev = _context7.next) {
                        case 0:
                          messageValues = [message, subject, member.user_id, id];
                          inboxValues = [member.user_id, email, 'unread'];
                          sentValues = [id, member.user_id, 'sent'];
                          _context7.next = 5;
                          return (0, _newMessage.default)(messageValues, inboxValues, sentValues);

                        case 5:
                          _ref12 = _context7.sent;
                          rows = _ref12.rows;
                          return _context7.abrupt("return", rows[0]);

                        case 8:
                        case "end":
                          return _context7.stop();
                      }
                    }
                  }, _callee7);
                }));

                return function (_x15) {
                  return _ref11.apply(this, arguments);
                };
              }());
              _context8.next = 15;
              return Promise.all(groupMember);

            case 15:
              result = _context8.sent;
              displayResult = [{
                id: result[0].message_id,
                createdOn: result[0].created_on,
                subject: result[0].subject,
                message: result[0].message,
                parentMessageId: result[0].parent_message_id,
                status: 'Sent'
              }];
              return _context8.abrupt("return", (0, _serverResponse.serverResponse)(res, 201, 'status', 'data', displayResult));

            case 20:
              _context8.prev = 20;
              _context8.t0 = _context8["catch"](0);
              return _context8.abrupt("return", (0, _serverResponse.serverError)(res));

            case 23:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8, null, [[0, 20]]);
    }));

    function groupMessage(_x13, _x14) {
      return _groupMessage.apply(this, arguments);
    }

    return groupMessage;
  }()
};
var _default = groupControllers;
exports.default = _default;