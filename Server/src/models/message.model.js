class Message {
  constructor() {
    this.id = null;
    this.createdOn = null;
    this.subject = null;
    this.message = null;
    this.parentMessageID = 1;
    this.status = draft;
  }
}

export default Message;
