import { Pool } from 'pg';
import dotenv from 'dotenv';


dotenv.config();
const messageControllers = {
  async createMessage(req, res) {
    const newMessage = req.body;
    const msgObj = {};
    const msgKeys = Object.keys(newMessage);
    const msgField = Object.values(newMessage);
    for (let i = 0; i < msgField.length; i++) {
      if (typeof msgField[i] === 'string') {
        msgObj[msgKeys[i]] = msgField[i].trim();
      }
    }
    if (!msgObj.subject || !msgObj.message || !msgObj.email) {
      return res.status(404).json({
        status: 404,
        error: 'Subject and Message input fields are required'
      });
    }
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL
    });
    pool.connect();
    console.log('connected to the db');
    try {
      const { message, subject, email } = msgObj;
      const myUserEmail = req.tokenData.email;
      const receiverEmailSql = await pool.query('SELECT * FROM users WHERE email=($1);', [email]);
      const receiverId = receiverEmailSql.rows[0].id;
      const myUserObj = await pool.query('SELECT * FROM users WHERE email=($1);', [myUserEmail]);
      const myUserObjId = myUserObj.rows[0].id;
      const result = await pool.query('INSERT INTO messages (messages, subject, receiver_id, sender_id) VALUES ($1, $2, $3, $4)', [message, subject, receiverId, myUserObjId]);

      return res.status(201).json({
        status: 201,
        data: [result]
      });
    } catch (err) {
      console.log(`The error message is ${err}`);
      return res.status(404).json({
        status: 404,
        error: 'input fields are required'
      });
    }
  },

  async findUnreadMessages(req, res) {
    const retrievedEmail = req.tokenData.email;
    console.log(retrievedEmail);
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL
    });
    pool.connect();
    console.log('connected to the db');
    try {
      const usersSql = 'SELECT * FROM users WHERE email=$1';
      const usersEmail = await pool.query(usersSql, [retrievedEmail]);
      console.log(usersEmail.rows[0]);
      const inboxSql = 'SELECT * FROM inbox WHERE receiver_id=$1';

      console.log(inboxSql.rows[0]);

      await pool.query(inboxSql, [usersSql.rows[0].id]);
    } catch (err) {
      console.log(`The error message is ${err}`);
    }
    return res.status(200).json({
      status: 200,
      data: "Hello"
    });
  },
  async findAllReceivedMessages(req, res) {
    const retrievedEmail = req.tokenData.email;
    console.log(retrievedEmail);
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL
    });
    pool.connect();
    console.log('connected to the db');
    try {
      const usersSql = 'SELECT * FROM users WHERE email=$1';
      const usersEmail = await pool.query(usersSql, [retrievedEmail]);
      const usersId = usersEmail.rows[0].id;
      console.log(usersEmail.rows[0].id);
      const inboxSql = 'SELECT * FROM inbox WHERE receiver_id=$1';
      const inboxId = await pool.query(inboxSql, [usersId]);
      console.log(inboxId.rows[0].id);
    } catch (err) {
      console.log(`The error is ${err}`);
    }

    return res.status(200).json({
      status: 200,
      data: 'Hello folk'
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
