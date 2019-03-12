"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _message = _interopRequireDefault(require("../controllers/message.controller"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = (0, _express.Router)();
router.post('/', _message.default.createMessage);
router.get('/', _message.default.findAllReceivedMessages);
router.get('/unread', _message.default.findUnreadMessages);
router.get('/sent', _message.default.findSentMessages);
router.get('/:id', _message.default.getOneMessage);
router.delete('/:id', _message.default.deleteMessage);
var _default = router;
exports.default = _default;