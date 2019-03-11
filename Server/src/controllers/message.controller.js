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
    return res.json({
      status: 201,
      data: newMessage
    });
  },

  findUnreadMessages(req, res) {
    const unreadMessages = messageServices.findUnreadMessages();
    return res.json({
      status: 201,
      data: unreadMessages
    });
  },
  findAllReceivedMessages(req, res) {
    const allMessages = messageServices.getAllReceivedMessages();
    return res.json({
      status: 201,
      data: allMessages
    });
  },
  findSentMessages(req, res) {
    const sentMessage = messageServices.findSentMessages();
    return res.json({
      status: 201,
      data: sentMessage
    });
  },

  getOneMessage(req, res) {
    const messageID = Number(req.params.id);
    const message = messageServices.getOneMessage(messageID);
    return res.json({
      status: 201,
      data: message
    });
  }
  // deleteMessage(req, res) {
  //   const messageID = Number(req.params.id);
  //   const message = messageServices.deleteMessage(messageID);
  //   return res.json({
  //     status: 200,
  //     data: message
  //   });
  // }

};

export default messageControllers;
