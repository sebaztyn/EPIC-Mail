import 'dotenv/config';
import dbQuery from '../models/db-connection';
import serverError from '../helper/error';
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
      const receiverId = receiverData[0].id;

      const messageValues = [message, subject, receiverId, myUserId];
      const inboxValues = [receiverId, myEmail, 'unread'];
      const sentValues = [myUserId, receiverId, 'sent'];
      const { rows } = await messaging(messageValues, inboxValues, sentValues);

      return res.status(201).json({
        status: 201,
        data: [
          {
            subject: rows[0].subject,
            message: rows[0].message,
            createdOn: rows[0].created_on,
            senderId: myEmail
          }
        ]
      });
    } catch (err) {
      return serverError(req, res);
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
        text: 'SELECT * FROM messages WHERE message_id=ANY($1)',
        values: [messageId]
      };
      const { rows } = await dbQuery(messageData);
      if (!rows.length) {
        return res.status(200).json({
          status: 200,
          data: 'You have no unread message'
        });
      }
      return res.status(200).json({
        status: 200,
        data: rows
      });
    } catch (err) {
      return serverError(req, res);
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
        text: `SELECT msg.message_id, msg.subject, msg.message, msg.created_on, msg.sender_id, msg.receiver_id, inbox.sender_email, msg.parent_message_id, inbox.status
         FROM messages AS msg
         JOIN inbox ON msg.message_id=inbox.message_id
         WHERE inbox.receiver_id=$1`,
        values: [usersId]
      };
      const { rows } = await dbQuery(userInboxData);
      if (!rows.length) {
        return res.status(200).json({
          status: 200,
          message: "You have no received message(s)"
        });
      }
      return res.status(200).json({
        status: 200,
        data: rows
      });
    } catch (err) {
      return serverError(req, res);
    }
  },
  async findSentMessages(req, res) {
    try {
      const { id } = req.tokenData;
      const sentMessageData = {
        text: `SELECT * FROM messages AS msg
        JOIN sent ON msg.message_id = sent.sent_message_id
        WHERE sent.sender_id=$1`,
        values: [id]
      };
      const { rows } = await dbQuery(sentMessageData);
      if (!rows.length) {
        return res.status(200).json({
          status: 200,
          message: "You have no sent message(s)"
        });
      }
      return res.status(200).json({
        status: 200,
        data: rows
      });
    } catch (err) {
      return serverError(req, res);
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
        text: `SELECT msg.message_id, msg.subject, msg.message, msg.created_on, msg.sender_id, msg.receiver_id, inbox.sender_email, msg.parent_message_id, inbox.status
        FROM messages AS msg
        JOIN inbox ON msg.receiver_id=inbox.receiver_id
        WHERE msg.message_id=$1 AND msg.receiver_id=$2 AND inbox.status =$3`,
        values: [messageID, id, 'read']
      };
      const { rows } = await dbQuery(messageData);

      if (!rows.length) {
        return res.status(404).json({
          status: 404,
          message: "Message not found"
        });
      }
      return res.status(200).json({
        status: 200,
        data: [rows[0]]
      });
    } catch (err) {
      return serverError(req, res);
    }
  },
  async getOneSentMessage(req, res) {
    const messageID = Number(req.params.id);
    try {
      const messageData = {
        text: `SELECT msg.message_id, msg.subject, msg.message, msg.created_on, msg.sender_id, msg.receiver_id, msg.parent_message_id, sent.status
        FROM messages AS msg
        JOIN sent ON msg.sender_id=sent.sender_id
        WHERE msg.message_id=$1`,
        values: [messageID]
      };
      const { rows } = await dbQuery(messageData);
      if (!rows.length) {
        return res.status(404).json({
          status: 404,
          message: "Message not found"
        });
      }
      return res.status(200).json({
        status: 200,
        data: [rows[0]]
      });
    } catch (err) {
      return serverError(req, res);
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
        return res.status(404).json({
          status: 404,
          Error: "Message is missing or has been deleted"
        });
      }
      const inboxToDelete = {
        text: `DELETE FROM inbox
        WHERE message_id=$1 AND receiver_id=$2`,
        values: [messageID, id]
      };
      await dbQuery(inboxToDelete);
      return res.status(200).json({
        status: 200,
        data: [{ message: 'Message Deleted' }]
      });
    } catch (err) {
      return serverError(req, res);
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
        return res.status(404).json({
          status: 404,
          Error: "Message is missing or has been deleted"
        });
      }
      const sentToDelete = {
        text: `DELETE FROM sent
         WHERE sent_id=$1`,
        values: [sentMessageID]
      };
      await dbQuery(sentToDelete);
      return res.status(200).json({
        status: 200,
        data: [{ message: 'Message Deleted' }]
      });
    } catch (err) {
      return serverError(req, res);
    }
  }
};

export default messageControllers;