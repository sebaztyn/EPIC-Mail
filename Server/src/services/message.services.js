import allData from '../utils/allData';

const today = new Date().toLocaleDateString(undefined, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
});

const messageServices = {
  createMessage(messageObj) {
    const messageArr = allData.messages;
    const messageLength = messageArr.length;
    const lastMessageID = messageArr[messageLength - 1].id;
    messageObj.id = lastMessageID + 1;
    messageObj.createdOn = today;
    messageArr.push(messageObj);
    return messageObj;
  },

  // findSentMessages() {
  //   const messageArr = allData.messages;
  //   const sentMessages = messageArr.filter(each => each.status === 'sent');
  //   return sentMessages;
  // },
  findUnreadMessages() {
    const messageArr = allData.messages;
    const unreadMessages = messageArr.filter(each => each.status === 'unread');
    return unreadMessages;
  },

  getAllReceivedMessages() {
    const messageArr = allData.messages;
    const receivedMessages = messageArr.filter((each) => {
      if (each.status === 'read' || each.status === 'unread') {
        return each;
      }
    });
    return [...receivedMessages];
  }

  // getOneMessage(id) {
  //   const messageArr = allData.messages;
  //   const searchedMessage = messageArr.find(message => message.id === id);
  //   return searchedMessage;
  // },

  // deleteMessage(id) {
  //   const messageArr = allData.messages;
  //   const messageIndex = messageArr.findIndex(message => message.id === id);
  //   const messageToDelete = messageArr.splice(messageIndex, 1);
  //   return messageToDelete;
  // }
};

export default messageServices;
