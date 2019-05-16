"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _msgControl = _interopRequireDefault(require("../controller/msgControl"));

var _authentication = _interopRequireDefault(require("../middleware/authentication"));

var _validator = _interopRequireDefault(require("../middleware/validator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = (0, _express.Router)();
router.post('/', _authentication.default, _validator.default.createMessageValidator, _msgControl.default.createMessage);
router.get('/', _authentication.default, _msgControl.default.findAllReceivedMessages);
router.get('/unread', _authentication.default, _msgControl.default.findUnreadMessages);
router.get('/sent', _authentication.default, _msgControl.default.findSentMessages);
router.get('/:id', _authentication.default, _msgControl.default.getOneInboxMessage);
router.get('/sent/:id', _authentication.default, _msgControl.default.getOneSentMessage);
router.delete('/:id', _authentication.default, _msgControl.default.deleteInboxMessage);
router.delete('/sent/:sentMessageId', _authentication.default, _msgControl.default.deleteSentMessage);
var _default = router;
exports.default = _default;