"use strict";

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

var _server = _interopRequireDefault(require("../src/server"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var expect = _chai.default.expect;

_chai.default.use(_chaiHttp.default);

describe('Testing endpoints', function () {
  it('It should post new user data to the database', function (done) {
    _chai.default.request(_server.default).post('/api/v1/auth/signup').send({
      email: 'sebastinocj@yahoo.com',
      firstName: 'Chima',
      lastName: 'Ekeneme',
      password: 'kluej',
      username: 'sebaztyn',
      recoveryEmail: 'sebastinechima@gmail.com'
    }).end(function (err, res) {
      if (err) return done(err);
      expect(res.body).to.haveOwnProperty('status');
      expect(res.status).to.equal(201);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.all.keys('status', 'data');
      expect(res.body).to.haveOwnProperty('status').that.equals(201);
      expect(res.body).to.haveOwnProperty('data').that.is.an('array');
      expect(res.body).to.haveOwnProperty('data').that.is.an('array');
      expect(res.body.data).to.be.an('array');
      expect(res.body.data[0]).to.be.an('object');
      expect(res.body.data[0]).to.haveOwnProperty('token');
      done();
    });
  });
  it('It allow user saved in the database access to the login page', function (done) {
    _chai.default.request(_server.default).post('/api/v1/auth/login').send({
      email: 'sebastinocj@yahoo.com',
      password: 'klue'
    }).end(function (err, res) {
      if (err) return done(err);
      expect(res.body).to.be.an('object');
      expect(res.body).to.haveOwnProperty('status').that.is.a('number');
      expect(res.body).to.haveOwnProperty('data').that.is.an('array');
      expect(res.body.data[0]).to.haveOwnProperty('token').that.is.an('string');
      done();
    });
  });
});
describe('Creating and Testing  API endpoint for Receiving Messages', function () {
  it('it  should return specific keys "allMessages and Status" when a call is made to all received messages', function (done) {
    _chai.default.request(_server.default).get('/api/v1/messages').end(function (err, res) {
      if (err) {
        done(err);
      }

      expect(res.body).to.have.keys('status', 'data');
      expect(res.body).to.have.ownProperty('status').that.equals(200);
      expect(res.body).to.have.ownProperty('data').to.be.an('array');
      expect(res.body.data[0].subject).to.be.a('string');
      expect(res.body.data[0].message).to.be.a('string');
      expect(res.body.data[0].id).to.be.a('number');
      expect(res.body.data[0].status).to.be.a('string');
      expect(res.body.data[0].parentMessageId).to.be.a('number');
      done();
    });
  });
});
describe('Fetching all unread Messages', function () {
  it('it  should return specific value:UNREAD when a call is made to all received unread messages', function (done) {
    _chai.default.request(_server.default).get('/api/v1/messages/unread').end(function (err, res) {
      if (err) {
        done(err);
      }

      expect(res.body).to.have.keys('status', 'data');
      expect(res.body).to.have.ownProperty('status').that.equals(200);
      expect(res.body).to.have.ownProperty('data').to.be.an('array');
      expect(res.body.data[0].subject).to.be.a('string');
      expect(res.body.data[0].message).to.be.a('string');
      expect(res.body.data[0].id).to.be.a('number');
      expect(res.body.data[0].status).to.be.a('string');
      expect(res.body.data[0].status).to.equal('unread');
      expect(res.body.data[0].parentMessageId).to.be.a('number');
      done();
    });
  });
});
describe('Fetching all sent Messages', function () {
  it('it  should return specific value:SENT when a call is made to all sent messages', function (done) {
    _chai.default.request(_server.default).get('/api/v1/messages/sent').end(function (err, res) {
      if (err) {
        done(err);
      }

      expect(res.body).to.have.keys('status', 'data');
      expect(res.body).to.have.ownProperty('status').that.equals(200);
      expect(res.body).to.have.ownProperty('data').to.be.an('array');
      expect(res.body.data[0].subject).to.be.a('string');
      expect(res.body.data[0].message).to.be.a('string');
      expect(res.body.data[0].id).to.be.a('number');
      expect(res.body.data[0].status).to.be.a('string');
      expect(res.body.data[0].status).to.equal('sent');
      expect(res.body.data[0].parentMessageId).to.be.a('number');
      done();
    });
  });
});
describe('Fetching a specific Message', function () {
  it('it  should return a unique message matching the ID of the searched Message', function (done) {
    _chai.default.request(_server.default).get('/api/v1/messages/1').end(function (err, res) {
      if (err) {
        done(err);
      }

      expect(res.body).to.have.keys('status', 'data');
      expect(res.body).to.have.ownProperty('status').that.equals(200);
      expect(res.body).to.have.ownProperty('data').to.be.an('array');
      expect(res.body.data[0].message).to.be.a('string');
      expect(res.body.data[0].id).to.be.a('number');
      expect(res.body.data[0].parentMessageId).to.be.a('number');
      done();
    });
  });
});
describe('Deleting a specific Message', function () {
  it('it  should return a unique matching the ID of the deleted Message', function (done) {
    _chai.default.request(_server.default).delete('/api/v1/messages/2').end(function (err, res) {
      if (err) {
        done(err);
      }

      expect(res.body).to.have.keys('status', 'data');
      expect(res.body).to.have.ownProperty('status').that.equals(200);
      expect(res.body).to.have.ownProperty('data').to.be.an('array');
      expect(res.body.data[0].message).to.be.a('string');
      done();
    });
  });
});
describe('Creating a Message', function () {
  it('It should post user Message to the database', function (done) {
    _chai.default.request(_server.default).post('/api/v1/messages').send({
      subject: 'Are you Available',
      message: 'Can we meetup at 5pm?',
      parentMessageId: 17,
      senderId: 1
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
});