const today = new Date().toLocaleDateString(undefined, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
});

export default{
  users: [
    {
      id: 1,
      email: 'sebastinocj@yahoo.com',
      firstName: 'Chima',
      lastName: 'Ekeneme',
      password: 'klue',
      username: 'sebaztyn',
      recoveryEmail: 'sebastinechima@gmail.com'
    }
    // {
    //   id: 2,
    //   email: 'sebtecc@yahoo.com',
    //   firstName: 'Chimezie',
    //   lastName: 'E.',
    //   password: 'klbjvccxue',
    //   username: 'good',
    //   recoveryEmail: 'sebastinechima@gmail.com'
    // }
  ],
  messages: [
    {
      id: 1,
      createdOn: today,
      subject: 'Are you Available',
      message: 'Can we meetup at Andela Towers?',
      parentMessageId: 1,
      status: 'draft'
    },
    {
      id: 2,
      createdOn: today,
      subject: 'Are you Available',
      message: 'Can we meetup at Andela Towers?',
      parentMessageId: 2,
      status: 'unread',
      receiverId: 1,
      senderId: 1
    },
    {
      id: 3,
      createdOn: today,
      subject: 'Are you Available',
      message: 'Can we meetup at Andela Towers?',
      parentMessageId: 3,
      status: 'draft'
    },
    {
      id: 4,
      createdOn: today,
      subject: 'Are you Available',
      message: 'Can we meetup at Andela Towers?',
      parentMessageId: 4,
      status: 'unread',
      receiverId: 2,
      senderId: 2
    },
    {
      id: 5,
      createdOn: today,
      subject: 'Are you Available',
      message: 'Can we meetup at Andela Towers?',
      parentMessageId: 5,
      status: 'read',
      receiverId: 3,
      senderId: 3
    },
    {
      id: 6,
      createdOn: today,
      subject: 'Are you Available',
      message: 'Can we meetup at Andela Towers?',
      parentMessageId: 6,
      status: 'read',
      receiverId: 4,
      senderId: 4
    },
    {
      id: 7,
      createdOn: today,
      subject: 'Are you Available',
      message: 'Can we meetup at Andela Towers?',
      parentMessageId: 7,
      status: 'unread',
      receiverId: 5,
      senderId: 5
    },
    {
      id: 8,
      createdOn: today,
      subject: 'Are you Available',
      message: 'Can we meetup at Andela Towers?',
      parentMessageId: 8,
      status: 'draft'
    },
    {
      id: 9,
      createdOn: today,
      subject: 'Are you Available',
      message: 'Can we meetup at Andela Towers?',
      parentMessageId: 9,
      status: 'read',
      receiverId: 6,
      messageId: 6
    },
    {
      id: 10,
      createdOn: today,
      subject: 'Are you Available',
      message: 'Can we meetup at 5pm?',
      parentMessageId: 10,
      senderId: 1,
      status: 'sent'
    },
    {
      id: 11,
      createdOn: today,
      subject: 'Are you Available',
      message: 'Can we meetup at Eiffel Towers?',
      parentMessageId: 11,
      status: 'draft'
    },
    {
      id: 12,
      createdOn: today,
      subject: 'Are you Available',
      message: 'Can we meetup at Amazon stores?',
      parentMessageId: 12,
      status: 'draft'
    },
    {
      id: 13,
      createdOn: today,
      subject: 'Are you Available',
      message: 'Can we meetup at Silicon Valley?',
      parentMessageId: 13,
      receiverId: 1,
      status: 'read'

    },
    {
      id: 14,
      createdOn: today,
      subject: 'Are you Available',
      message: 'Can we meetup at Facebook Towers?',
      parentMessageId: 14,
      status: 'read',
      messageId: 7,
      receiverId: 7,
      senderId: 1
    },
    {
      id: 15,
      createdOn: today,
      subject: 'Are you Available',
      message: 'Can we meetup at Trump Towers?',
      parentMessageId: 15,
      messageId: 2,
      senderId: 2,
      status: 'sent'
    },
    {
      id: 16,
      createdOn: today,
      subject: 'Are you Available',
      message: 'Can we meetup at Google Towers?',
      parentMessageId: 16,
      messageId: 3,
      senderId: 3,
      status: 'sent'
    }
  ]
};
