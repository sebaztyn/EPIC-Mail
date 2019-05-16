"use strict";

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _server = _interopRequireDefault(require("../src/server"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv.default.config();

var expect = _chai.default.expect;

_chai.default.use(_chaiHttp.default);

var testUser = {
  email: 'sebastinocj@yahoo.com',
  firstName: 'Chima',
  lastName: 'Ekeneme',
  password: 'Qwertyuiop1?',
  username: 'sebaztyn',
  recoveryEmail: 'sebastinechima@gmail.com'
};
var testUser2 = {
  email: 'uche@yahoo.com',
  firstName: 'Uche',
  lastName: 'Ekeneme',
  password: 'Qwertyuiop1?',
  username: 'Uche',
  recoveryEmail: 'chima@gmail.com'
};
var testToken = null;
describe('USER CREATION AND LOGIN', function () {
  before(function (done) {
    _chai.default.request(_server.default).post('/api/v1/auth/signup').send(testUser2).end(function (err, res) {
      if (err) return done(err);
      done();
    });
  });
  before(function (done) {
    _chai.default.request(_server.default).post('/api/v1/auth/signup').send({
      email: 'Iheoma@yahoo.com',
      firstName: 'Iheoma',
      lastName: 'Ekeneme',
      password: 'Qwertyuiop1?',
      username: 'Alex',
      recoveryEmail: 'Iheoma@gmail.com'
    }).end(function (err, res) {
      if (err) return done(err);
      done();
    });
  });
  it('should post new user data to the database', function (done) {
    _chai.default.request(_server.default).post('/api/v1/auth/signup').send(testUser).end(function (err, res) {
      if (err) return done(err);
      expect(res.body).to.haveOwnProperty('status');
      expect(res.status).to.equal(201);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.all.keys('status', 'data');
      expect(res.body).to.haveOwnProperty('status').that.equals(201);
      expect(res.body).to.haveOwnProperty('data').that.is.an('array');
      expect(res.body.data).to.be.an('array');
      expect(res.body.data[0]).to.be.an('object');
      expect(res.body.data[0]).to.haveOwnProperty('token');
      done();
    });
  });
  it('allows user saved in the database access to the login page', function (done) {
    _chai.default.request(_server.default).post('/api/v1/auth/login').send({
      email: 'sebastinocj@yahoo.com',
      password: 'Qwertyuiop1?'
    }).end(function (err, res) {
      testToken = res.body.data[0].token;
      if (err) return done(err);
      expect(res.body).to.be.an('object');
      expect(res.body).to.haveOwnProperty('status').that.is.a('number');
      expect(res.body).to.haveOwnProperty('data').that.is.an('array');
      expect(res.body.data[0]).to.haveOwnProperty('token').that.is.a('string');
      done();
    });
  });
  it('allows user saved in the database to RESET password', function (done) {
    _chai.default.request(_server.default).post('/api/v1/auth/reset').send({
      email: 'sebastinocj@yahoo.com'
    }).end(function (err, res) {
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
describe('MESSAGES ENDPOINTS', function () {
  var userToken = null;
  var secondToken = null;
  describe('Checking for Errors and Empty Retrievals from server', function () {
    var errorToken = null;
    before(function (done) {
      _chai.default.request(_server.default).post('/api/v1/auth/signup').send({
        email: 'johndoe@yahoo.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'Qwertyuiop1?',
        username: 'Jon',
        recoveryEmail: 'johndoe@gmail.com'
      }).end(function (err, res) {
        errorToken = res.body.data[0].token;
        if (err) return done(err);
        done();
      });
    });
    it('should return status code 200 when a request is made to retrieve messages from an empty INBOX', function (done) {
      _chai.default.request(_server.default).get('/api/v1/messages').set('x-authorization', errorToken).end(function (err, res) {
        if (err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys('status', 'message');
        expect(res.body).to.have.ownProperty('status').that.equals(200);
        expect(res.body).to.have.ownProperty('message').to.be.a('string');
        done();
      });
    });
    it('should return status code 200 when a request is made to retrieve UNREAD messages for user with NO UNREAD message', function (done) {
      _chai.default.request(_server.default).get('/api/v1/messages/unread').set('x-authorization', errorToken).end(function (err, res) {
        if (err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys('status', 'message');
        expect(res.body).to.have.ownProperty('status').that.equals(200);
        expect(res.body).to.have.ownProperty('message').to.be.a('string');
        done();
      });
    });
    it('should return status code 200 when a request is made to retrieve SENT messages for user with NO SENT message', function (done) {
      _chai.default.request(_server.default).get('/api/v1/messages/sent').set('x-authorization', errorToken).end(function (err, res) {
        if (err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys('status', 'message');
        expect(res.body).to.have.ownProperty('status').that.equals(200);
        expect(res.body).to.have.ownProperty('message').to.be.a('string');
        done();
      });
    });
    it('should return an Error 404 when the wrong messageID is used as a parameter in retrieving a specific SENT message', function (done) {
      _chai.default.request(_server.default).get('/api/v1/messages/sent/1').set('x-authorization', errorToken).end(function (err, res) {
        if (err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body).to.have.ownProperty('status').that.equals(404);
        expect(res.body).to.have.ownProperty('error').to.be.a('string');
        done();
      });
    });
    it('should return an Error 404 when the wrong messageID is used as a parameter in retrieving a specific INBOX message', function (done) {
      _chai.default.request(_server.default).get('/api/v1/messages/30').set('x-authorization', errorToken).end(function (err, res) {
        if (err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body).to.have.ownProperty('status').that.equals(404);
        expect(res.body).to.have.ownProperty('error').to.be.a('string');
        done();
      });
    });
    it('should return an Error 404 when the wrong messageID is used as a parameter in DELETING a specific INBOX message', function (done) {
      _chai.default.request(_server.default).delete('/api/v1/messages/30').set('x-authorization', errorToken).end(function (err, res) {
        if (err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body).to.have.ownProperty('status').that.equals(404);
        expect(res.body).to.have.ownProperty('error').to.be.a('string');
        done();
      });
    });
    it('should return an Error 404 when the wrong messageID is used as a parameter in DELETING a specific SENT message', function (done) {
      _chai.default.request(_server.default).delete('/api/v1/messages/sent/30').set('x-authorization', errorToken).end(function (err, res) {
        if (err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body).to.have.ownProperty('status').that.equals(404);
        expect(res.body).to.have.ownProperty('error').to.be.a('string');
        done();
      });
    });
  });
  before(function (done) {
    _chai.default.request(_server.default).post('/api/v1/auth/login').send({
      email: 'uche@yahoo.com',
      password: 'Qwertyuiop1?'
    }).end(function (err, res) {
      userToken = res.body.data[0].token;
      if (err) return done(err);
      done();
    });
  });
  before(function (done) {
    _chai.default.request(_server.default).post('/api/v1/auth/login').send({
      email: 'sebastinocj@yahoo.com',
      password: 'Qwertyuiop1?'
    }).end(function (err, res) {
      secondToken = res.body.data[0].token;
      if (err) return done(err);
      done();
    });
  });
  before(function (done) {
    _chai.default.request(_server.default).post('/api/v1/messages').set('x-authorization', userToken).send({
      subject: 'Are you Ready',
      message: 'Chelsea is coming to town!!!!!!!',
      email: 'sebastinocj@yahoo.com'
    }).end(function (err, res) {
      if (err) return done(err);
      done();
    });
  });
  before(function (done) {
    _chai.default.request(_server.default).post('/api/v1/messages').set('x-authorization', userToken).send({
      subject: 'Integration test alert !!!!!!!!!',
      message: 'We are running an integrated tests on our endpoints',
      email: 'sebastinocj@yahoo.com'
    }).end(function (err, res) {
      if (err) return done(err);
      done();
    });
  });
  before(function (done) {
    _chai.default.request(_server.default).post('/api/v1/messages').set('x-authorization', secondToken).send({
      subject: 'Are you Ready',
      message: 'Chelsea is coming to town!!!!!!!',
      email: 'uche@yahoo.com'
    }).end(function (err, res) {
      if (err) return done(err);
      done();
    });
  });
  before(function (done) {
    _chai.default.request(_server.default).post('/api/v1/messages').set('x-authorization', secondToken).send({
      subject: 'Integration test alert !!!!!!!!!',
      message: 'We are running an integrated tests on our endpoints',
      email: 'uche@yahoo.com'
    }).end(function (err, res) {
      if (err) return done(err);
      done();
    });
  });
  before(function (done) {
    _chai.default.request(_server.default).post('/api/v1/messages').set('x-authorization', testToken).send({
      subject: 'Let us check',
      message: 'We are running a check',
      email: 'uche@yahoo.com'
    }).end(function (err, res) {
      if (err) return done(err);
      done();
    });
  });
  before(function (done) {
    _chai.default.request(_server.default).post('/api/v1/messages').set('x-authorization', testToken).send({
      subject: 'Let us go again',
      message: 'We are running a check to be sure',
      email: 'iheoma@yahoo.com'
    }).end(function (err, res) {
      if (err) return done(err);
      done();
    });
  });
  it('should post user Message to the database', function (done) {
    _chai.default.request(_server.default).post('/api/v1/messages').set('x-authorization', secondToken).send({
      subject: 'Are you Available',
      message: 'Can we meetup at 5pm?',
      email: 'uche@yahoo.com'
    }).end(function (err, res) {
      if (err) return done(err);
      expect(res.body).to.haveOwnProperty('status');
      expect(res.body).to.haveOwnProperty('status').that.is.a('number');
      expect(res.body).to.haveOwnProperty('data');
      expect(res.body).to.haveOwnProperty('data').that.is.an('array');
      expect(res.status).to.equal(201);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.all.keys('status', 'data');
      expect(res.body).to.haveOwnProperty('status').that.equals(201);
      done();
    });
  });
  it('should return all received messages when a call is made to the endpoint', function (done) {
    _chai.default.request(_server.default).get('/api/v1/messages').set('x-authorization', secondToken).end(function (err, res) {
      if (err) return done(err);
      expect(res.body).to.have.keys('status', 'data');
      expect(res.body).to.have.ownProperty('status').that.equals(200);
      expect(res.body).to.have.ownProperty('data').to.be.an('array');
      expect(res.body.data[0].subject).to.be.a('string');
      expect(res.body.data[0].message).to.be.a('string'); // PostgreSQL BIGINT datatype returns a string and not a number

      expect(res.body.data[0].message_id).to.be.a('string');
      expect(res.body.data[0]).to.be.an('object');
      done();
    });
  });
  it('should return specific value:UNREAD when a call is made to all received unread messages', function (done) {
    _chai.default.request(_server.default).get('/api/v1/messages/unread').set('x-authorization', testToken).end(function (err, res) {
      if (err) {
        done(err);
      }

      expect(res.body).to.have.keys('status', 'data');
      expect(res.body).to.have.ownProperty('status').that.equals(200);
      expect(res.body).to.have.ownProperty('data').to.be.an('array');
      expect(res.body.data[0].subject).to.be.a('string');
      expect(res.body.data[0].message).to.be.a('string'); // PostgreSQL BIGINT datatype returns a string and not a number

      expect(res.body.data[0].message_id).to.be.a('string');
      expect(res.body.status).to.be.a('number');
      expect(res.body.status).to.equal(200);
      done();
    });
  });
  it('should return specific value:SENT when a call is made to all sent messages', function (done) {
    _chai.default.request(_server.default).get('/api/v1/messages/sent').set('x-authorization', testToken).end(function (err, res) {
      if (err) done(err);
      expect(res.body).to.have.keys('status', 'data');
      expect(res.body).to.have.ownProperty('status').that.equals(200);
      expect(res.body).to.have.ownProperty('data').to.be.an('array');
      expect(res.body.data[0].subject).to.be.a('string');
      expect(res.body.data[0].message).to.be.a('string'); // PostgreSQL BIGINT datatype returns a string and not a number

      expect(res.body.data[0].message_id).to.be.a('string');
      expect(res.body.status).to.be.a('number');
      expect(res.body.status).to.equal(200);
      done();
    });
  });
  it('should return a unique INBOX message matching the message ID', function (done) {
    _chai.default.request(_server.default).get('/api/v1/messages/1').set('x-authorization', testToken).end(function (err, res) {
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
  it('should return a unique SENT message matching the message ID', function (done) {
    _chai.default.request(_server.default).get('/api/v1/messages/sent/5').set('x-authorization', testToken).end(function (err, res) {
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
  it('should return a message stating that an INBOX message was deleted successfully', function (done) {
    _chai.default.request(_server.default).delete('/api/v1/messages/2').set('x-authorization', testToken).end(function (err, res) {
      if (err) done(err);
      expect(res.body).to.have.keys('status', 'data');
      expect(res.body).to.have.ownProperty('status').that.equals(200);
      expect(res.body).to.have.ownProperty('data').to.be.an('array');
      expect(res.body.data[0].message).to.be.a('string');
      expect(res.body.data).to.be.an('array');
      expect(res.body).to.be.an('object');
      done();
    });
  });
  it('should return a message stating that a SENT message was deleted successfully', function (done) {
    _chai.default.request(_server.default).delete('/api/v1/messages/sent/2').set('x-authorization', testToken).end(function (err, res) {
      if (err) done(err);
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
describe('GROUP ENDPOINTS', function () {
  describe('Checking for all groups where a user is a member or an admin', function () {
    var errorToken2 = null;
    before(function (done) {
      _chai.default.request(_server.default).post('/api/v1/auth/login').send({
        email: 'johndoe@yahoo.com',
        password: 'Qwertyuiop1?'
      }).end(function (err, res) {
        errorToken2 = res.body.data[0].token;
        if (err) return done(err);
        done();
      });
    });
    it('should return status code 200 and a message stating that user should create or join a group when a request is made to retrieve ALL GROUPS by a user who has NEITHER JOINED OR CREATED A GROUP', function (done) {
      _chai.default.request(_server.default).get('/api/v1/groups').set('x-authorization', errorToken2).end(function (err, res) {
        if (err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys('status', 'message');
        expect(res.body).to.have.ownProperty('status').that.equals(200);
        expect(res.body).to.have.ownProperty('message').to.be.a('string');
        done();
      });
    });
  });
  describe('Checking if a group already exist at the point of creation', function () {
    var errorToken3 = null;
    before(function (done) {
      _chai.default.request(_server.default).post('/api/v1/auth/login').send({
        email: 'johndoe@yahoo.com',
        password: 'Qwertyuiop1?'
      }).end(function (err, res) {
        errorToken3 = res.body.data[0].token;
        if (err) return done(err);
        done();
      });
    });
    before(function (done) {
      _chai.default.request(_server.default).post('/api/v1/groups').set('x-authorization', errorToken3).send({
        name: 'My ERROR Test group 1'
      }).end(function (err, res) {
        if (err) return done(err);
        done();
      });
    });
    it('should return status code 404 when a request is made to send AN EMAIL TO GROUP WHERE THE ONLY MEMBER IS THE GROUP CREATOR', function (done) {
      _chai.default.request(_server.default).post('/api/v1/groups/4/messages').set('x-authorization', errorToken3).send({
        subject: 'Are you Available',
        message: 'Can we meetup at 5pm?'
      }).end(function (err, res) {
        if (err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body).to.have.ownProperty('status').that.equals(404);
        expect(res.body).to.have.ownProperty('error').to.be.a('string');
        done();
      });
    });
    it('should return status code 400 when a request is made to retrieve AN ALREADY CREATED GROUP', function (done) {
      _chai.default.request(_server.default).post('/api/v1/groups').set('x-authorization', errorToken3).send({
        name: 'My ERROR Test group 1'
      }).end(function (err, res) {
        if (err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys('status', 'Error');
        expect(res.body).to.have.ownProperty('status').that.equals(400);
        expect(res.body).to.have.ownProperty('Error').to.be.a('string');
        done();
      });
    });
    it('should return status code 403 when a request is made to DELETE a NON-EXISTENT group', function (done) {
      _chai.default.request(_server.default).delete('/api/v1/groups/30').set('x-authorization', errorToken3).end(function (err, res) {
        if (err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body).to.have.ownProperty('status').that.equals(403);
        expect(res.body).to.have.ownProperty('error').to.be.a('string');
        done();
      });
    });
    it('should return status code 404 when a request is made to DELETE a NON-EXISTENT USER from a group', function (done) {
      _chai.default.request(_server.default).delete('/api/v1/groups/4/users/6').set('x-authorization', errorToken3).end(function (err, res) {
        if (err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body).to.have.ownProperty('status').that.equals(404);
        expect(res.body).to.have.ownProperty('error').to.be.a('string');
        done();
      });
    });
    it('should return status code 400 when a request is made to CHANGE THE NAME AN EXISTING GROUP', function (done) {
      _chai.default.request(_server.default).patch('/api/v1/groups/4/name').set('x-authorization', errorToken3).send({
        name: ''
      }).end(function (err, res) {
        if (err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body).to.have.ownProperty('status').that.equals(422);
        expect(res.body).to.have.ownProperty('error').to.be.a('string');
        done();
      });
    });
    it('should return status code 400 when a request is made to ADD A USER TO GROUP with an unregistered email', function (done) {
      _chai.default.request(_server.default).post('/api/v1/groups/4/users/').set('x-authorization', errorToken3).send({
        email: 'dadadada@yahoo.com'
      }).end(function (err, res) {
        if (err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys('status', 'Error');
        expect(res.body).to.have.ownProperty('status').that.equals(400);
        expect(res.body).to.have.ownProperty('Error').to.be.a('string');
        done();
      });
    });
  });
  before(function (done) {
    _chai.default.request(_server.default).post('/api/v1/groups').set('x-authorization', testToken).send({
      name: 'My Test group 1'
    }).end(function (err, res) {
      if (err) return done(err);
      done();
    });
  });
  before(function (done) {
    _chai.default.request(_server.default).post('/api/v1/groups').set('x-authorization', testToken).send({
      name: 'My Test group 2'
    }).end(function (err, res) {
      if (err) return done(err);
      done();
    });
  });
  before(function (done) {
    _chai.default.request(_server.default).post('/api/v1/groups/1/users/').set('x-authorization', testToken).send({
      email: 'Iheoma@yahoo.com'
    }).end(function (err, res) {
      if (err) return done(err);
      done();
    });
  });
  it('should post group to the database', function (done) {
    _chai.default.request(_server.default).post('/api/v1/groups').set('x-authorization', testToken).send({
      name: 'My first group'
    }).end(function (err, res) {
      if (err) return done(err);
      expect(res.body).to.haveOwnProperty('status');
      expect(res.body).to.haveOwnProperty('status').that.is.a('number');
      expect(res.body).to.haveOwnProperty('data');
      expect(res.body).to.haveOwnProperty('data').that.is.an('array');
      expect(res.status).to.equal(201);
      expect(res.body).to.be.an('object');
      expect(res.body.data[0]).to.be.an('object');
      expect(res.body.data[0].name).to.be.a('string');
      expect(res.body).to.have.all.keys('status', 'data');
      expect(res.body).to.haveOwnProperty('status').that.equals(201);
      done();
    });
  });
  it('should return all groups created by a particular user when a request to the endpoint', function (done) {
    _chai.default.request(_server.default).get('/api/v1/groups').set('x-authorization', testToken).end(function (err, res) {
      if (err) return done(err);
      expect(res.body).to.have.keys('status', 'data');
      expect(res.body).to.have.ownProperty('status').that.equals(200);
      expect(res.body).to.have.ownProperty('data').to.be.an('array');
      expect(res.body.data[0].name).to.be.a('string');
      expect(res.body.data[0].admin_id).to.be.a('number'); // PostgreSQL BIGINT datatype returns a string and not a number

      expect(res.body.data[0].group_id).to.be.a('number');
      expect(res.body.data[0]).to.be.an('object');
      done();
    });
  });
  it('should change the name of a group in the database successfully', function (done) {
    _chai.default.request(_server.default).patch('/api/v1/groups/1/name').set('x-authorization', testToken).send({
      name: 'My changed name'
    }).end(function (err, res) {
      if (err) return done(err);
      expect(res.body).to.haveOwnProperty('status');
      expect(res.body).to.haveOwnProperty('status').that.is.a('number');
      expect(res.body).to.haveOwnProperty('data');
      expect(res.body).to.haveOwnProperty('data').that.is.an('array');
      expect(res.status).to.equal(201);
      expect(res.body).to.be.an('object');
      expect(res.body.data[0]).to.be.an('object');
      expect(res.body.data[0].name).to.be.a('string');
      expect(res.body).to.have.all.keys('status', 'data');
      expect(res.body).to.haveOwnProperty('status').that.equals(201);
      done();
    });
  });
  it('should post a NEW USER to the database', function (done) {
    _chai.default.request(_server.default).post('/api/v1/groups/1/users/').set('x-authorization', testToken).send({
      email: 'uche@yahoo.com'
    }).end(function (err, res) {
      if (err) return done(err);
      expect(res.body).to.haveOwnProperty('status');
      expect(res.body).to.haveOwnProperty('status').that.is.a('number');
      expect(res.body).to.haveOwnProperty('data');
      expect(res.body).to.haveOwnProperty('data').that.is.an('array');
      expect(res.status).to.equal(201);
      expect(res.body).to.be.an('object');
      expect(res.body.data[0]).to.be.an('object');
      expect(res.body.data[0].userRole).to.be.a('string');
      expect(res.body.data[0].userId).to.be.a('number');
      expect(res.body).to.have.all.keys('status', 'data');
      expect(res.body.data[0]).to.have.all.keys('groupId', 'userId', 'userRole');
      expect(res.body).to.haveOwnProperty('status').that.equals(201);
      done();
    });
  });
  it('should post an email to the group', function (done) {
    _chai.default.request(_server.default).post('/api/v1/groups/1/messages').set('x-authorization', testToken).send({
      subject: 'Are you Available',
      message: 'Can we meetup at 5pm?'
    }).end(function (err, res) {
      if (err) return done(err);
      expect(res.body).to.haveOwnProperty('status');
      expect(res.body).to.haveOwnProperty('status').that.is.a('number');
      expect(res.body).to.haveOwnProperty('data');
      expect(res.body).to.haveOwnProperty('data').that.is.an('array');
      expect(res.status).to.equal(201);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.all.keys('status', 'data');
      expect(res.body).to.haveOwnProperty('status').that.equals(201);
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
  it('should delete a PARTICULAR USER from the group members table successfully', function (done) {
    _chai.default.request(_server.default).delete('/api/v1/groups/1/users/1').set('x-authorization', testToken).end(function (err, res) {
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
  it('should delete a user\'s group in the database successfully', function (done) {
    _chai.default.request(_server.default).delete('/api/v1/groups/2').set('x-authorization', testToken).end(function (err, res) {
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