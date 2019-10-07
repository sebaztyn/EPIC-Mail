import 'dotenv/config';
import dbQuery from '../models/db-connection';
import { serverError, serverResponse } from '../helper/serverResponse';
import messaging from '../helper/newMessage';

const messageControllers = {
  async createMessage(req, res) {
    try {
      const { message, subject, email } = req.body;
      const myEmail = req.tokenData.email;
      const myUserId = req.tokenData.id;
      const receiverQuery = {
        text: `SELECT * FROM users WHERE email=$1`,
        values: [email]
      };
      const { rows: receiverData } = await dbQuery(receiverQuery);
      if (!receiverQuery.length) return serverResponse(res, 400, 'status', 'error', 'Email is not signed up');
      const receiverId = receiverData[0].id;
      const messageValues = [message, subject, receiverId, myUserId];
      const inboxValues = [receiverId, myEmail, 'unread'];
      const sentValues = [myUserId, receiverId, 'sent'];
      const { rows } = await messaging(messageValues, inboxValues, sentValues);
      const resultValues = [{
        id: rows[0].message_id,
        subject: rows[0].subject,
        message: rows[0].message,
        createdOn: rows[0].created_on,
        senderId: myEmail,
        receiverEmail: email
      }];

      return serverResponse(res, 201, 'status', 'data', resultValues);
    } catch (err) {
      return serverError(res, err);
    }
  },
  async findUnreadMessages(req, res) {
    try {
      const retrievedEmail = req.tokenData.email;
      const userData = {
        text: 'SELECT * FROM users WHERE email=$1',
        values: [retrievedEmail]
      };
      const userInfo = await dbQuery(userData);

      const inboxQuery = {
        text: `SELECT * FROM inbox
        WHERE receiver_id=$1 AND status=$2`,
        values: [userInfo.rows[0].id, 'unread']
      };
      const inbox = await dbQuery(inboxQuery);
      const messageId = inbox.rows.map((each => each.message_id));
      const messageData = {
        text: `SELECT DISTINCT inbox.sender_email,users.firstname,users.lastname, msg.message_id, msg.subject, msg.message, msg.created_on, msg.sender_id, msg.receiver_id, msg.parent_message_id, inbox.status FROM messages AS msg
        JOIN inbox ON msg.message_id=inbox.message_id
        JOIN users ON msg.sender_id = users.id
        WHERE msg.message_id=ANY($1)`,
        values: [messageId]
      };
      const { rows } = await dbQuery(messageData);
      if (!rows.length) {
        return serverResponse(res, 200, 'status', 'message', 'You have no unread message');
      }
      return serverResponse(res, 200, 'status', 'data', rows);
    } catch (err) {
      return serverError(res, err);
    }
  },
  async findAllReceivedMessages(req, res) {
    try {
      const retrievedEmail = req.tokenData.email;
      const userData = {
        text: 'SELECT * FROM users WHERE email=$1',
        values: [retrievedEmail]
      };
      const userInfo = await dbQuery(userData);
      const usersId = userInfo.rows[0].id;

      const userInboxData = {
        text: `SELECT DISTINCT msg.message_id, msg.subject, msg.message,
        u.firstname,u.lastname, msg.created_on, msg.sender_id, msg.receiver_id, inbox.sender_email, msg.parent_message_id, inbox.status
         FROM messages AS msg
         JOIN inbox ON msg.message_id=inbox.message_id
         JOIN users ON msg.receiver_id = users.id
         JOIN users AS u ON msg.sender_id=u.id
         WHERE inbox.receiver_id=$1
        ORDER BY msg.message_id DESC`,
        values: [usersId]
      };
      const { rows } = await dbQuery(userInboxData);
      if (!rows.length) {
        return serverResponse(res, 200, 'status', 'message', 'You have no received message(s)');
      }
      return serverResponse(res, 200, 'status', 'data', rows);
    } catch (err) {
      return serverError(res, err);
    }
  },
  async findSentMessages(req, res) {
    try {
      const { id } = req.tokenData;
      const sentMessageData = {
        text: `SELECT DISTINCT users.firstname, users.lastname,users.email, msg.message_id, msg.subject, msg.message, msg.created_on, msg.sender_id, msg.receiver_id, msg.parent_message_id
        FROM messages AS msg
        JOIN sent ON msg.message_id = sent.sent_message_id
        JOIN users ON sent.receiver_id = users.id
        WHERE sent.sender_id=$1
        ORDER BY msg.message_id DESC`,
        values: [id]
      };
      const { rows } = await dbQuery(sentMessageData);
      if (!rows.length) {
        return serverResponse(res, 200, 'status', 'message', 'You have no sent message(s)');
      }
      return serverResponse(res, 200, 'status', 'data', rows);

    } catch (err) {
      return serverError(res, err);
    }
  },
  async getOneInboxMessage(req, res) {
    const messageID = Number(req.params.id);
    const { id } = req.tokenData;
    try {
      const inboxQuery = {
        text: `UPDATE inbox
        SET status = $1
        WHERE receiver_id=$2 AND message_id=$3`,
        values: ['read', id, messageID]
      };
      await dbQuery(inboxQuery);

      const messageData = {
        text: `SELECT DISTINCT inbox.sender_email,users.firstname,users.lastname, msg.message_id, msg.subject, msg.message, msg.created_on, msg.sender_id, msg.receiver_id, msg.parent_message_id, inbox.status
		    FROM messages AS msg
        JOIN users ON users.id=msg.sender_id
        JOIN inbox ON msg.message_id=inbox.message_id
        WHERE msg.message_id=$1;`,
        values: [messageID]
      };
      const { rows } = await dbQuery(messageData);

      if (!rows.length) {
        return serverResponse(res, 404, 'status', 'error', 'Message not found');
      }
      return serverResponse(res, 200, 'status', 'data', rows);

    } catch (err) {
      return serverError(res, err);
    }
  },
  async getOneSentMessage(req, res) {
    const messageID = Number(req.params.id);
    const { id } = req.tokenData;
    try {
      const messageData = {
        text: `SELECT DISTINCT users.email, msg.message_id, msg.subject, msg.message, msg.created_on, msg.sender_id, msg.receiver_id, msg.parent_message_id, sent.status
        FROM messages AS msg
        JOIN users ON msg.receiver_id=users.id
        JOIN sent ON msg.sender_id=sent.sender_id
        WHERE msg.message_id=$1 AND sent.sender_id=$2`,
        values: [messageID, id]
      };
      const { rows } = await dbQuery(messageData);
      if (!rows.length) {
        return serverResponse(res, 404, 'status', 'error', 'Message not found');
      }
      return serverResponse(res, 200, 'status', 'data', rows);
    } catch (err) {
      return serverError(res, err);
    }
  },
  async deleteInboxMessage(req, res) {
    const messageID = Number(req.params.id);
    const { id } = req.tokenData;
    try {
      const messageData = {
        text: `SELECT * FROM messages
        WHERE message_id=$1`,
        values: [messageID]
      };
      const { rows } = await dbQuery(messageData);
      if (!rows.length) {
        return serverResponse(res, 404, 'status', 'error', 'Message is missing or has been deleted');
      }
      const inboxToDelete = {
        text: `DELETE FROM inbox
        WHERE message_id=$1 AND receiver_id=$2`,
        values: [messageID, id]
      };
      await dbQuery(inboxToDelete);
      return serverResponse(res, 200, 'status', 'data', [{ message: 'Message Deleted' }]);
    } catch (err) {
      return serverError(res, err);
    }
  },
  async deleteSentMessage(req, res) {
    try {
      const sentMessageID = Number(req.params.sentMessageId);
      const sentMessageData = {
        text: `SELECT * FROM sent
         WHERE sent_id=$1`,
        values: [sentMessageID]
      };
      const { rows } = await dbQuery(sentMessageData);
      if (!rows.length) {
        return serverResponse(res, 404, 'status', 'error', 'Message is missing or has been deleted');
      }
      const sentToDelete = {
        text: `DELETE FROM sent
         WHERE sent_id=$1`,
        values: [sentMessageID]
      };
      await dbQuery(sentToDelete);
      return serverResponse(res, 200, 'status', 'data', [{ message: 'Message Deleted' }]);
    } catch (err) {
      return serverError(res, err);
    }
  }
};

export default messageControllers;
