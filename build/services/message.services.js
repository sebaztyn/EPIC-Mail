"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _allData = _interopRequireDefault(require("../utils/allData"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var today = new Date().toLocaleDateString(undefined, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
});
var messageServices = {
  createMessage: function createMessage(messageObj) {
    var messageArr = _allData.default.messages;
    var messageLength = messageArr.length;
    var lastMessageID = messageArr[messageLength - 1].id;
    messageObj.id = lastMessageID + 1;
    messageObj.createdOn = today;
    messageArr.push(messageObj);
    return messageObj;
  },
  getAllReceivedMessages: function getAllReceivedMessages() {
    var messageArr = _allData.default.messages;
    var receivedMessages = messageArr.filter(function (each) {
      if (each.status === 'read' || each.status === 'unread') {
        return each;
      }
    });
    return _toConsumableArray(receivedMessages);
  },
  findSentMessages: function findSentMessages() {
    var messageArr = _allData.default.messages;
    var sentMessages = messageArr.filter(function (each) {
      return each.status === 'sent';
    });
    return sentMessages;
  },
  findUnreadMessages: function findUnreadMessages() {
    var messageArr = _allData.default.messages;
    var unreadMessages = messageArr.filter(function (each) {
      return each.status === 'unread';
    });
    return unreadMessages;
  },
  getOneMessage: function getOneMessage(id) {
    var messageArr = _allData.default.messages;
    var searchedMessage = messageArr.find(function (message) {
      return message.id === id;
    });
    return searchedMessage;
  },
  deleteMessage: function deleteMessage(id) {
    var messageArr = _allData.default.messages;
    var messageIndex = messageArr.findIndex(function (message) {
      return message.id === id;
    });

    if (messageIndex !== -1) {
      messageArr.splice(messageIndex, 1);
      return true;
    }

    return false;
  }
};
var _default = messageServices;
exports.default = _default;