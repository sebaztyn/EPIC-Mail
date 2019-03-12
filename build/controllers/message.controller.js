"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _message = _interopRequireDefault(require("../services/message.services"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var messageControllers = {
  createMessage: function createMessage(req, res) {
    var messageDetails = req.body;

    var newMessage = _message.default.createMessage(messageDetails);

    var msgObj = {};
    var msgKeys = Object.keys(newMessage);
    var msgField = Object.values(newMessage);

    for (var i = 0; i < msgField.length; i++) {
      if (typeof msgField[i] === 'string') {
        msgObj[msgKeys[i]] = msgField[i].trim();
      }
    }

    if (!newMessage.subject || !newMessage.message) {
      return res.status(404).json({
        status: 404,
        error: 'Subject and Message input fields are required'
      });
    }

    return res.json({
      status: 201,
      data: newMessage
    });
  },
  findUnreadMessages: function findUnreadMessages(req, res) {
    var unreadMessages = _message.default.findUnreadMessages();

    return res.json({
      status: 201,
      data: unreadMessages
    });
  },
  findAllReceivedMessages: function findAllReceivedMessages(req, res) {
    var allMessages = _message.default.getAllReceivedMessages();

    return res.json({
      status: 201,
      data: allMessages
    });
  },
  findSentMessages: function findSentMessages(req, res) {
    var sentMessage = _message.default.findSentMessages();

    return res.json({
      status: 201,
      data: sentMessage
    });
  },
  getOneMessage: function getOneMessage(req, res) {
    var messageID = Number(req.params.id);

    var message = _message.default.getOneMessage(messageID);

    return res.json({
      status: 201,
      data: message
    });
  },
  deleteMessage: function deleteMessage(req, res) {
    var messageID = Number(req.params.id);

    var message = _message.default.deleteMessage(messageID);

    return res.json({
      status: 200,
      data: message
    });
  }
};
var _default = messageControllers;
exports.default = _default;