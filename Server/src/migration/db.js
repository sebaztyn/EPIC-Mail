import '@babel/polyfill';

const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_TEST
});

const dropTables = async () => {
  const userTables = `DROP TABLE IF EXISTS users CASCADE`;
  const messageTable = `DROP TABLE IF EXISTS messages CASCADE`;
  const inboxTable = `DROP TABLE IF EXISTS inbox CASCADE`;
  const sentTable = `DROP TABLE IF EXISTS sent CASCADE`;
  const groupTable = `DROP TABLE IF EXISTS my_group CASCADE`;
  const groupMemberTable = `DROP TABLE IF EXISTS my_group_members CASCADE`;
  try {
    await pool.query(userTables);
    await pool.query(messageTable);
    await pool.query(inboxTable);
    await pool.query(sentTable);
    await pool.query(groupTable);
    await pool.query(groupMemberTable);
  } catch (err) {
  }

};

const createTables = async () => {
  const usersTable = `CREATE TABLE users(
      id BIGSERIAL PRIMARY KEY NOT NULL,
      firstname VARCHAR(45) NOT NULL,
      lastname VARCHAR(45) NOT NULL,
      email VARCHAR(128) NOT NULL UNIQUE,
      username VARCHAR(30) NOT NULL,
      password VARCHAR(128) NOT NULL,
      recoveryEmail VARCHAR(128) NOT NULL
      );`;
  const messagesTable = `CREATE TABLE messages(
     message_id BIGSERIAL PRIMARY KEY NOT NULL,
      message TEXT,
      subject TEXT,
      created_on TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      sender_id INTEGER REFERENCES users(id) NOT NULL,
      receiver_id INTEGER REFERENCES users(id) NOT NULL,
      parent_message_id INTEGER
    );`;
  const inboxTable = `CREATE TABLE inbox(
      inbox_id BIGSERIAL PRIMARY KEY NOT NULL,
      sender_email VARCHAR(128) REFERENCES users(email) NOT NULL,
      message_id INTEGER REFERENCES messages(message_id) NOT NULL,
      receiver_id INTEGER REFERENCES users(id) NOT NULL,
      status VARCHAR(20) NOT NULL
    );`;
  const sentTable = `CREATE TABLE sent(
      sent_id BIGSERIAL PRIMARY KEY NOT NULL,
      sent_message_id INTEGER REFERENCES messages(message_id) NOT NULL,
      sender_id INTEGER REFERENCES users(id) NOT NULL,
      receiver_id INTEGER REFERENCES users(id) NOT NULL,
      status VARCHAR(20) NOT NULL
    );`;

  const myGroupTable = `CREATE TABLE my_group(
      id BIGSERIAL PRIMARY KEY NOT NULL,
      name VARCHAR(60),
      admin_id INT REFERENCES users(id) NOT NULL
    );`;

  const myGroupMembersTable = `CREATE TABLE my_group_members(
      id BIGSERIAL PRIMARY KEY NOT NULL,
      user_id INTEGER REFERENCES users(id) NOT NULL,
      group_id INTEGER REFERENCES my_group(id) NOT NULL,
      user_role VARCHAR(20)
    );`;
  try {
    await pool.query(usersTable);
    await pool.query(messagesTable);
    await pool.query(inboxTable);
    await pool.query(sentTable);
    await pool.query(myGroupTable);
    await pool.query(myGroupMembersTable);
  } catch (err) {
  }
};

const callTables = async () => {
  await dropTables();
  await createTables();
  await process.exit(0);
};

callTables();
