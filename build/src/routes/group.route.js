"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _groupController = _interopRequireDefault(require("../controller/groupController"));

var _authentication = _interopRequireDefault(require("../middleware/authentication"));

var _isAdmin = _interopRequireDefault(require("../middleware/isAdmin"));

var _validator = _interopRequireDefault(require("../middleware/validator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = (0, _express.Router)();
router.post('/', _authentication.default, _validator.default.createNewGroup, _groupController.default.createGroup);
router.post('/:groupId/messages', _authentication.default, _validator.default.groupMessageValidator, _groupController.default.groupMessage);
router.post('/:groupId/users/', _authentication.default, _isAdmin.default, _validator.default.addGroupUsers, _groupController.default.addUser);
router.get('/', _authentication.default, _groupController.default.getAllGroupsByAUser);
router.patch('/:groupId/name', _authentication.default, _isAdmin.default, _validator.default.changeGroupName, _groupController.default.changeGroupName);
router.delete('/:groupId', _authentication.default, _isAdmin.default, _groupController.default.deleteAgroup);
router.delete('/:groupId/users/:userid', _authentication.default, _isAdmin.default, _groupController.default.deleteUser);
var _default = router;
exports.default = _default;