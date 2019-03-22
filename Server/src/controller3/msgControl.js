import { Pool } from 'pg';
import dotenv from 'dotenv';


dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
pool.connect();
console.log('connected to the db');


const messageControllers = {
  async createMessage(req, res) {
    const newMessage = req.body;
    const msgObj = {};
    const msgKeys = Object.keys(newMessage);
    const msgField = Object.values(newMessage);
    for (let i = 0; i < msgField.length; i++) {
      if (typeof msgField[i] === 'string') { msgObj[msgKeys[i]] = msgField[i].trim(); }
    }
    if (!msgObj.subject || !msgObj.message || !msgObj.email) {
      return res.status(404).json({
        status: 404,
        error: 'Subject and Message input fields are required'
      });
    }
    try {
      const { message, subject, email } = msgObj;
      const myUserEmail = req.tokenData.email;
      const receiverEmailSql = await pool.query('SELECT * FROM users WHERE email=($1);', [email]);
      const receiverId = receiverEmailSql.rows[0].id;
      const myUserObj = await pool.query('SELECT * FROM users WHERE email=($1);', [myUserEmail]);
      const myUserObjId = myUserObj.rows[0].id;
      const { rows } = await pool.query('INSERT INTO messages (messages, subject, receiver_id, sender_id) VALUES ($1, $2, $3, $4) RETURNING * ', [message, subject, receiverId, myUserObjId]);
      const resultId = rows[0].id;
      const readProperty = 'unread';
      await pool.query('INSERT INTO inboxs (message_id, receiver_id, status) VALUES ($1, $2, $3)', [resultId, receiverId, readProperty]);
      return res.status(201).json({
        status: 201,
        data: [
          {
            subject: rows[0].subject,
            message: rows[0].messages,
            createdOn: rows[0].created_on,
            senderId: myUserEmail
          }
        ]
      });
    } catch (err) {
      return res.status(404).json({
        status: 404,
        error: 'input fields are required'
      });
    }
  },
  async findUnreadMessages(req, res) {
    const retrievedEmail = req.tokenData.email;
    try {
      const usersSql = 'SELECT * FROM users WHERE email=$1';
      const usersEmail = await pool.query(usersSql, [retrievedEmail]);
      const inboxSql = 'SELECT * FROM inboxs WHERE receiver_id=$1 AND status=$2';
      const inbox = await pool.query(inboxSql, [usersEmail.rows[0].id, 'unread']);
      const messageId = inbox.rows.map((each => each.message_id));
      const messageSql = 'SELECT * FROM messages WHERE id= ANY($1)';
      const { rows } = await pool.query(messageSql, [messageId]);
      if (!row.length) {
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
      return res.status(200).json({
        status: 200,
        data: "No unread message found"
      });
    }

  },
  async findAllReceivedMessages(req, res) {
    const retrievedEmail = req.tokenData.email;
    try {
      const usersSql = 'SELECT * FROM users WHERE email=$1';
      const usersEmail = await pool.query(usersSql, [retrievedEmail]);
      const usersId = usersEmail.rows[0].id;
      const inboxSql = 'SELECT * FROM inboxs WHERE receiver_id=$1';
      const inboxId = await pool.query(inboxSql, [usersId]);
      const messageId = inboxId.rows.map((each => each.message_id));
      const messageSql = 'SELECT * FROM messages WHERE id= ANY($1)';
      const { rows } = await pool.query(messageSql, [messageId]);
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
      return res.status(200).json({
        status: 200,
        data: 'No message found'
      });
    }
  },
  async findSentMessages(req, res) {
    const retrievedEmail = req.tokenData.email;
    try {
      const sql = 'SELECT id FROM users WHERE email=$1';
      const retrievedId = await pool.query(sql, [retrievedEmail]);
      const messageSql = 'SELECT * FROM messages WHERE sender_id=$1';
      const { rows } = await pool.query(messageSql, [retrievedId.rows[0].id]);
      if (!rows.length)
      {
        return res.status(200).json({
          status: 200,
          message: "You have no sent message(s)"
        });
      }
    } catch (err) {
      return res.status(200).json({
        status: 200,
        data: "No sent Message"
      });
    }
  },
  async getOneMessage(req, res) {
    const messageID = Number(req.params.id);
    try {
      const messageSql = 'SELECT * FROM messages WHERE id=$1';
      const { rows } = await pool.query(messageSql, [messageID]);
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
      return res.status(404).json({
        status: 404,
        Error: "Message not found"
      });
    }
  },
  async deleteMessage(req, res) {
    const messageID = Number(req.params.id);
    try {
      const messageTableSql = 'SELECT * FROM messages WHERE id=$1';
      const { rows } = await pool.query(messageTableSql, [messageID]);
      if (!rows.length) {
        return res.status(404).json({
          status: 404,
          Error: "Message is missing or has been deleted"
        });
      }
      const messageSql = 'DELETE FROM messages WHERE id=$1';
      await pool.query(messageSql, [messageID]);
      return res.status(200).json({
        status: 200,
        data: [{ message: 'Message Deleted' }]
      });
    } catch (err) {
      return res.status(404).json({
        status: 404,
        Error: "Message not found"
      });
    }
  }
};

export default messageControllers;
