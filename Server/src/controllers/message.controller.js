import messageServices from '../services/message.services';


const messageControllers = {
  createMessage(req, res) {
    const messageDetails = req.body;
    const newMessage = messageServices.createMessage(messageDetails);
    const msgObj = {};
    const msgKeys = Object.keys(newMessage);
    const msgField = Object.values(newMessage);
    for (let i = 0; i < msgField.length; i++) {
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
    return res.status(201).json({
      status: 201,
      data: [newMessage]
    });
  },

  findUnreadMessages(req, res) {
    const unreadMessages = messageServices.findUnreadMessages();
    return res.status(200).json({
      status: 200,
      data: unreadMessages
    });
  },
  findAllReceivedMessages(req, res) {
    const allMessages = messageServices.getAllReceivedMessages();
    return res.status(200).json({
      status: 200,
      data: allMessages
    });
  },
  findSentMessages(req, res) {
    const sentMessage = messageServices.findSentMessages();
    return res.status(200).json({
      status: 200,
      data: sentMessage
    });
  },

  getOneMessage(req, res) {
    const messageID = Number(req.params.id);
    const message = messageServices.getOneMessage(messageID);
    return res.status(200).json({
      status: 200,
      data: [message]
    });
  },
  deleteMessage(req, res) {
    const messageID = Number(req.params.id);
    const messageItem = messageServices.deleteMessage(messageID);
    if (messageItem) {
      return res.status(200).json({
        status: 200,
        data: [{
          message: 'message deleted successfully'
        }]
      });
    }
    return res.status(404).json({
      status: 404,
      data: [{
        message: 'message deleted successfully'
      }]
    });
  }
};

export default messageControllers;
