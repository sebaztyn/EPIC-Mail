import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import server from '../src/server';

dotenv.config();


const { expect } = chai;
chai.use(chaiHttp);

const testUser = {
  email: 'sebastinocj@yahoo.com',
  firstName: 'Chima',
  lastName: 'Ekeneme',
  password: 'Qwertyuiop1?',
  username: 'sebaztyn',
  recoveryEmail: 'sebastinechima@gmail.com'
};
const testUser2 = {
  email: 'uche@yahoo.com',
  firstName: 'Uche',
  lastName: 'Ekeneme',
  password: 'Qwertyuiop1?',
  username: 'Uche',
  recoveryEmail: 'chima@gmail.com'
};
let testToken = null;

describe('USER CREATION AND LOGIN', () => {
  before((done) => {
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(testUser2)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
  it('should post new user data to the database', (done) => {
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(testUser)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.haveOwnProperty('status');
        expect(res.status).to.equal(201);
        expect((res.body)).to.be.an('object');
        expect((res.body)).to.have.all.keys('status', 'data');
        expect((res.body)).to.haveOwnProperty('status').that.equals(201);
        expect((res.body)).to.haveOwnProperty('data').that.is.an('array');
        expect((res.body.data)).to.be.an('array');
        expect((res.body.data[0])).to.be.an('object');
        expect((res.body.data[0])).to.haveOwnProperty('token');
        done();
      });
  });
  it('allows user saved in the database access to the login page', (done) => {
    chai.request(server)
      .post('/api/v1/auth/login')
      .send({
        email: 'sebastinocj@yahoo.com',
        password: 'Qwertyuiop1?'
      })
      .end((err, res) => {
        testToken = res.body.data[0].token;
        if (err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body).to.haveOwnProperty('status').that.is.a('number');
        expect(res.body).to.haveOwnProperty('data').that.is.an('array');
        expect(res.body.data[0]).to.haveOwnProperty('token').that.is.a('string');
        done();
      });
  });
  it('allows user saved in the database to RESET password', (done) => {
    chai.request(server)
      .post('/api/v1/auth/reset')
      .send({
        email: 'sebastinocj@yahoo.com'
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body).to.haveOwnProperty('status').that.is.a('number');
        expect(res.body).to.haveOwnProperty('data').that.is.an('array');
        expect(res.body.data[0]).to.be.an('object');
        expect(res.body.data[0].email).to.be.a('string');
        expect(res.body.data[0].message).to.be.a('string');
        done();
      });
  });
});

describe('MESSAGES ENDPOINTS', () => {
  let userToken = null;
  let secondToken = null;
  before((done) => {
    chai.request(server)
      .post('/api/v1/auth/login')
      .send({
        email: 'uche@yahoo.com',
        password: 'Qwertyuiop1?'
      })
      .end((err, res) => {
        userToken = res.body.data[0].token;
        if (err) return done(err);
        done();
      });
  });
  before((done) => {
    chai.request(server)
      .post('/api/v1/auth/login')
      .send({
        email: 'sebastinocj@yahoo.com',
        password: 'Qwertyuiop1?'
      })
      .end((err, res) => {
        secondToken = res.body.data[0].token;
        if (err) return done(err);
        done();
      });
  });
  before((done) => {
    chai.request(server)
      .post('/api/v1/messages')
      .set('x-authorization', userToken)
      .send({
        subject: 'Are you Ready',
        message: 'Chelsea is coming to town!!!!!!!',
        email: 'sebastinocj@yahoo.com'
      })
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
  before((done) => {
    chai.request(server)
      .post('/api/v1/messages')
      .set('x-authorization', userToken)
      .send({
        subject: 'Integration test alert !!!!!!!!!',
        message: 'We are running an integrated tests on our endpoints',
        email: 'sebastinocj@yahoo.com'
      })
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
  before((done) => {
    chai.request(server)
      .post('/api/v1/messages')
      .set('x-authorization', secondToken)
      .send({
        subject: 'Are you Ready',
        message: 'Chelsea is coming to town!!!!!!!',
        email: 'uche@yahoo.com'
      })
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
  before((done) => {
    chai.request(server)
      .post('/api/v1/messages')
      .set('x-authorization', secondToken)
      .send({
        subject: 'Integration test alert !!!!!!!!!',
        message: 'We are running an integrated tests on our endpoints',
        email: 'uche@yahoo.com'
      })
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
  it('should post user Message to the database', (done) => {
    chai.request(server)
      .post('/api/v1/messages')
      .set('x-authorization', secondToken)
      .send({
        subject: 'Are you Available',
        message: 'Can we meetup at 5pm?',
        email: 'uche@yahoo.com'
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.haveOwnProperty('status');
        expect(res.body).to.haveOwnProperty('status').that.is.a('number');
        expect(res.body).to.haveOwnProperty('data');
        expect(res.body).to.haveOwnProperty('data').that.is.an('array');
        expect(res.status).to.equal(201);
        expect((res.body)).to.be.an('object');
        expect((res.body)).to.have.all.keys('status', 'data');
        expect((res.body)).to.haveOwnProperty('status').that.equals(201);
        done();
      });
  });
  it('should return all received messages when a call is made to the endpoint', (done) => {
    chai.request(server)
      .get('/api/v1/messages')
      .set('x-authorization', secondToken)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.keys('status', 'data');
        expect(res.body).to.have.ownProperty('status').that.equals(200);
        expect(res.body).to.have.ownProperty('data').to.be.an('array');
        expect(res.body.data[0].subject).to.be.a('string');
        expect(res.body.data[0].message).to.be.a('string');

        // PostgreSQL BIGINT datatype returns a string and not a number
        expect(res.body.data[0].message_id).to.be.a('string');
        expect(res.body.data[0]).to.be.an('object');
        done();
      });
  });
  it('should return specific value:UNREAD when a call is made to all received unread messages', (done) => {
    chai.request(server)
      .get('/api/v1/messages/unread')
      .set('x-authorization', testToken)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body).to.have.keys('status', 'data');
        expect(res.body).to.have.ownProperty('status').that.equals(200);
        expect(res.body).to.have.ownProperty('data').to.be.an('array');
        expect(res.body.data[0].subject).to.be.a('string');
        expect(res.body.data[0].message).to.be.a('string');

        // PostgreSQL BIGINT datatype returns a string and not a number
        expect(res.body.data[0].message_id).to.be.a('string');
        expect(res.body.status).to.be.a('number');
        expect(res.body.status).to.equal(200);
        done();
      });
  });
  it('should return specific value:SENT when a call is made to all sent messages', (done) => {
    chai.request(server)
      .get('/api/v1/messages/sent')
      .set('x-authorization', testToken)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body).to.have.keys('status', 'data');
        expect(res.body).to.have.ownProperty('status').that.equals(200);
        expect(res.body).to.have.ownProperty('data').to.be.an('array');
        expect(res.body.data[0].subject).to.be.a('string');
        expect(res.body.data[0].message).to.be.a('string');

        // PostgreSQL BIGINT datatype returns a string and not a number
        expect(res.body.data[0].message_id).to.be.a('string');
        expect(res.body.status).to.be.a('number');
        expect(res.body.status).to.equal(200);
        done();
      });
  });
  it('should return a unique INBOX message matching the message ID', (done) => {
    chai.request(server)
      .get('/api/v1/messages/1')
      .set('x-authorization', testToken)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.keys('status', 'data');
        expect(res.body).to.have.ownProperty('status').that.equals(200);
        expect(res.body).to.have.ownProperty('data').to.be.an('array');
        expect(res.body.data[0].message).to.be.a('string');
        expect(res.body.data[0].message_id).to.be.a('string');
        expect(res.body.data[0].sender_id).to.be.a('number');
        expect(res.body.data[0].receiver_id).to.be.a('number');
        expect(res.body.data[0].created_on).to.be.a('string');
        expect(res.body.data[0].subject).to.be.a('string');
        expect(res.body.data[0].status).to.be.a('string');
        done();
      });
  });
  it('should return a unique SENT message matching the message ID', (done) => {
    chai.request(server)
      .get('/api/v1/messages/sent/1')
      .set('x-authorization', testToken)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.keys('status', 'data');
        expect(res.body).to.have.ownProperty('status').that.equals(200);
        expect(res.body).to.have.ownProperty('data').to.be.an('array');
        expect(res.body.data[0].message).to.be.a('string');
        expect(res.body.data[0].message_id).to.be.a('string');
        expect(res.body.data[0].sender_id).to.be.a('number');
        expect(res.body.data[0].receiver_id).to.be.a('number');
        expect(res.body.data[0].created_on).to.be.a('string');
        expect(res.body.data[0].subject).to.be.a('string');
        expect(res.body.data[0].status).to.be.a('string');
        done();
      });
  });
  it('should return a message stating that an INBOX message was deleted successfully', (done) => {
    chai.request(server)
      .delete('/api/v1/messages/2')
      .set('x-authorization', testToken)
      .end((err, res) => {
        if (err)done(err);
        expect(res.body).to.have.keys('status', 'data');
        expect(res.body).to.have.ownProperty('status').that.equals(200);
        expect(res.body).to.have.ownProperty('data').to.be.an('array');
        expect(res.body.data[0].message).to.be.a('string');
        expect(res.body.data).to.be.an('array');
        expect(res.body).to.be.an('object');

        done();
      });
  });
  it('should return a message stating that a SENT message was deleted successfully', (done) => {
    chai.request(server)
      .delete('/api/v1/messages/sent/2')
      .set('x-authorization', testToken)
      .end((err, res) => {
        if (err)done(err);
        expect(res.body).to.have.keys('status', 'data');
        expect(res.body).to.have.ownProperty('status').that.equals(200);
        expect(res.body).to.have.ownProperty('data').to.be.an('array');
        expect(res.body.data[0].message).to.be.a('string');
        expect(res.body.data).to.be.an('array');
        expect(res.body).to.be.an('object');

        done();
      });
  });
});

describe('GROUP ENDPOINTS', () => {
  before((done) => {
    chai.request(server)
      .post('/api/v1/groups')
      .set('x-authorization', testToken)
      .send({
        name: 'My Test group 1'
      })
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
  before((done) => {
    chai.request(server)
      .post('/api/v1/groups')
      .set('x-authorization', testToken)
      .send({
        name: 'My Test group 2!!'
      })
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
  before((done) => {
    chai.request(server)
      .post('/api/v1/groups')
      .set('x-authorization', testToken)
      .send({
        name: 'My Test group 3!!!!!!'
      })
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });


  it('should post group to the database', (done) => {
    chai.request(server)
      .post('/api/v1/groups')
      .set('x-authorization', testToken)
      .send({
        name: 'My first group'
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.haveOwnProperty('status');
        expect(res.body).to.haveOwnProperty('status').that.is.a('number');
        expect(res.body).to.haveOwnProperty('data');
        expect(res.body).to.haveOwnProperty('data').that.is.an('array');
        expect(res.status).to.equal(201);
        expect((res.body)).to.be.an('object');
        expect((res.body.data[0])).to.be.an('object');
        expect((res.body.data[0].name)).to.be.a('string');
        expect((res.body)).to.have.all.keys('status', 'data');
        expect((res.body)).to.haveOwnProperty('status').that.equals(201);
        done();
      });
  });
  it('should return all groups created by a particular user when a request to the endpoint', (done) => {
    chai.request(server)
      .get('/api/v1/groups')
      .set('x-authorization', testToken)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.keys('status', 'data');
        expect(res.body).to.have.ownProperty('status').that.equals(200);
        expect(res.body).to.have.ownProperty('data').to.be.an('array');
        expect(res.body.data[0].name).to.be.a('string');
        expect(res.body.data[0].role).to.be.a('string');
        expect(res.body.data[0].admin_id).to.be.a('number');

        // PostgreSQL BIGINT datatype returns a string and not a number
        expect(res.body.data[0].id).to.be.a('string');
        expect(res.body.data[0]).to.be.an('object');
        done();
      });
  });
  it('should change the name of a group in the database successfully', (done) => {
    chai.request(server)
      .patch('/api/v1/groups/1/name')
      .set('x-authorization', testToken)
      .send({
        name: 'My changed name'
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.haveOwnProperty('status');
        expect(res.body).to.haveOwnProperty('status').that.is.a('number');
        expect(res.body).to.haveOwnProperty('data');
        expect(res.body).to.haveOwnProperty('data').that.is.an('array');
        expect(res.status).to.equal(201);
        expect((res.body)).to.be.an('object');
        expect((res.body.data[0])).to.be.an('object');
        expect((res.body.data[0].name)).to.be.a('string');
        expect((res.body)).to.have.all.keys('status', 'data');
        expect((res.body)).to.haveOwnProperty('status').that.equals(201);
        done();
      });
  });
  it('should post a NEW USER to the database', (done) => {
    chai.request(server)
      .post('/api/v1/groups/1/users/')
      .set('x-authorization', testToken)
      .send({
        email: 'uche@yahoo.com'
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.haveOwnProperty('status');
        expect(res.body).to.haveOwnProperty('status').that.is.a('number');
        expect(res.body).to.haveOwnProperty('data');
        expect(res.body).to.haveOwnProperty('data').that.is.an('array');
        expect(res.status).to.equal(201);
        expect((res.body)).to.be.an('object');
        expect((res.body.data[0])).to.be.an('object');
        expect((res.body.data[0].id)).to.be.a('string');
        expect((res.body.data[0].userRole)).to.be.a('string');
        expect((res.body.data[0].userId)).to.be.a('number');
        expect((res.body)).to.have.all.keys('status', 'data');
        expect((res.body.data[0])).to.have.all.keys('id', 'userId', 'userRole');
        expect((res.body)).to.haveOwnProperty('status').that.equals(201);
        done();
      });
  });
  it('should post an email to the group', (done) => {
    chai.request(server)
      .post('/api/v1/groups/1/messages')
      .set('x-authorization', testToken)
      .send({
        subject: 'Are you Available',
        message: 'Can we meetup at 5pm?'
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.haveOwnProperty('status');
        expect(res.body).to.haveOwnProperty('status').that.is.a('number');
        expect(res.body).to.haveOwnProperty('data');
        expect(res.body).to.haveOwnProperty('data').that.is.an('array');
        expect(res.status).to.equal(201);
        expect((res.body)).to.be.an('object');
        expect((res.body)).to.have.all.keys('status', 'data');
        expect((res.body)).to.haveOwnProperty('status').that.equals(201);
        expect(res.body.data[0]).to.be.an('object');
        expect(res.body.data[0].message).to.be.a('string');
        expect(res.body.data[0].subject).to.be.a('string');
        expect(res.body.data[0].id).to.be.a('string');
        expect(res.body.data[0].createdOn).to.be.a('string');
        expect(res.body.data[0].status).to.be.a('string');
        expect(res.body.data[0].status).that.equals('Sent');

        done();
      });
  });
  it('should delete a PARTICULAR USER from the group members table successfully', (done) => {
    chai.request(server)
      .delete('/api/v1/groups/1/users/1')
      .set('x-authorization', testToken)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.haveOwnProperty('status');
        expect(res.body).to.haveOwnProperty('status').that.is.a('number');
        expect(res.body).to.haveOwnProperty('data');
        expect(res.body).to.haveOwnProperty('data').that.is.an('array');
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.data[0]).to.be.an('object');
        expect(res.body.data[0].message).to.be.a('string');
        expect(res.body).to.have.all.keys('status', 'data');
        expect(res.body).to.haveOwnProperty('status').that.equals(200);
        done();
      });
  });
  it('should delete a user\'s group in the database successfully', (done) => {
    chai.request(server)
      .delete('/api/v1/groups/1')
      .set('x-authorization', testToken)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.haveOwnProperty('status');
        expect(res.body).to.haveOwnProperty('status').that.is.a('number');
        expect(res.body).to.haveOwnProperty('data');
        expect(res.body).to.haveOwnProperty('data').that.is.an('array');
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.data[0]).to.be.an('object');
        expect(res.body.data[0].message).to.be.a('string');
        expect(res.body).to.have.all.keys('status', 'data');
        expect(res.body).to.haveOwnProperty('status').that.equals(200);
        done();
      });
  });
});
