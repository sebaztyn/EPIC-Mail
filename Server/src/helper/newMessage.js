import dbQuery from '../models/db-connection';

const messaging = async (messageArr, inboxArr, sentArr) => {
  const messageQuery = {
    text: `INSERT INTO messages (message, subject, receiver_id, sender_id) VALUES ($1, $2, $3, $4) RETURNING * `,
    values: messageArr
  };
  const { rows } = await dbQuery(messageQuery);
  const resultId = rows[0].message_id;

  const inboxQuery = {
    text: `INSERT INTO inbox (message_id, receiver_id, sender_email, status) VALUES ($1, $2, $3, $4)`,
    values: [resultId, ...inboxArr]
  };
  await dbQuery(inboxQuery);
  const sentMessageQuery = {
    text: `INSERT INTO sent (sent_message_id, sender_id, receiver_id, status) VALUES ($1, $2, $3, $4)`,
    values: [resultId, ...sentArr]
  };
  await dbQuery(sentMessageQuery);

  return { rows };
};

// message = values: [message, subject, receiverId, myUserId]
// inbox = values: [resultId, receiverId, myEmail, 'unread']
// sent = values: [resultId, myUserId, receiverId, 'sent']

export default messaging;
