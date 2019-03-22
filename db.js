const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.NODE_ENV == 'production' ? process.env.DATABASE_URL : process.env.DEV_DATABASE_URL
});
pool.connect();
console.log('connected to the db');

const createTables = () => {
  const tableSql = `
    DROP TABLE IF EXISTS inboxs CASCADE;
    DROP TABLE IF EXISTS messages CASCADE;
    DROP TABLE IF EXISTS my_group CASCADE;
    DROP TABLE IF EXISTS my_group_members CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
    CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      firstname VARCHAR(45),
      lastname VARCHAR(45),
      email VARCHAR(128),
      username VARCHAR(30),
      password VARCHAR(128),
      recoveryEmail VARCHAR(128)
      );
    CREATE TABLE messages(
      id SERIAL PRIMARY KEY NOT NULL,
      messages TEXT,
      subject TEXT,
      created_on TIMESTAMP,
      sender_id INTEGER,
      receiver_id INTEGER,
      parent_message_id INTEGER
    );
    CREATE TABLE my_group(
      id SERIAL PRIMARY KEY NOT NULL,
      name VARCHAR(60),
      role VARCHAR(40)
    );
    CREATE TABLE my_group_members(
      id SERIAL PRIMARY KEY NOT NULL,
      user_id INTEGER REFERENCES users(id),
      user_role VARCHAR(20)
    );
    CREATE TABLE inboxs(
      message_id INTEGER REFERENCES messages(id),
      receiver_id INTEGER REFERENCES users(id),
      status VARCHAR(20)
    );
  `;
  pool.query(tableSql)
    .then((res) => {
      console.log('Tables created', res);
      pool.end();
    })
    .catch((err) => {
      console.log('Error', err);
      pool.end();
    });
};
return createTables();
