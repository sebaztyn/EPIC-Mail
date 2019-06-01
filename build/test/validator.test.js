"use strict";

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _server = _interopRequireDefault(require("../src/server"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv.default.config();

var expect = _chai.default.expect;

_chai.default.use(_chaiHttp.default);

var testUser3 = {
  email: 'james@yahoo.com',
  firstName: 'james',
  lastName: 'awarga',
  password: 'Qwertyuiop1?',
  username: 'jamie',
  recoveryEmail: 'james@gmail.com'
};
var testUser4 = {
  email: 'ifeanyi@yahoo.com',
  firstName: 'ifeanyi',
  lastName: 'okorie',
  password: 'Qwertyuiop1',
  username: 'ify',
  recoveryEmail: 'ify@gmail.com'
};
var testUser5 = {
  email: 'emmayahoo.com',
  firstName: 'Emmanuel',
  lastName: 'Lawrence',
  password: 'Qwertyuiop1?',
  username: 'emma',
  recoveryEmail: 'emma@gmail.com'
};
var testToken = null;
describe('Testing User SIGNUP/LOGIN and PASSWORD RESET validators', function () {
  before(function (done) {
    _chai.default.request(_server.default).post('/api/v1/auth/signup').send(testUser3).end(function (err, res) {
      if (err) return done(err);
      return done();
    });
  });
  before(function (done) {
    _chai.default.request(_server.default).post('/api/v1/auth/login').send({
      email: 'james@yahoo.com',
      password: 'Qwertyuiop1?'
    }).end(function (err, res) {
      testToken = res.body.token;
      if (err) return done(err);
      return done();
    });
  });
  it('should return an error status code 422 if the password is invalid - NEW USER ENDPOINT', function (done) {
    _chai.default.request(_server.default).post('/api/v1/auth/signup').send(testUser4).end(function (err, res) {
      if (err) return done(err);
      expect(res.body).to.haveOwnProperty('status');
      expect(res.status).to.equal(422);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.all.keys('status', 'error');
      expect(res.body).to.haveOwnProperty('status').that.equals(422);
      expect(res.body).to.haveOwnProperty('error').that.is.a('string');
      expect(res.body.error).to.be.a('string');
      return done();
    });
  });
  it('should return an error status code 422 if the email is invalid - NEW USER ENDPOINT', function (done) {
    _chai.default.request(_server.default).post('/api/v1/auth/signup').send(testUser5).end(function (err, res) {
      if (err) return done(err);
      expect(res.body).to.haveOwnProperty('status');
      expect(res.status).to.equal(422);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.all.keys('status', 'error');
      expect(res.body).to.haveOwnProperty('status').that.equals(422);
      expect(res.body).to.haveOwnProperty('error').that.is.a('string');
      expect(res.body.error).to.be.a('string');
      return done();
    });
  });
  it('should return an error status code 422 if the email is invalid - USER LOGIN ENDPOINT', function (done) {
    _chai.default.request(_server.default).post('/api/v1/auth/login').send({
      email: 'jame',
      password: 'Qwertyuiop1?'
    }).end(function (err, res) {
      if (err) return done(err);
      expect(res.status).to.equal(422);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.all.keys('status', 'error');
      expect(res.body).to.haveOwnProperty('status').that.equals(422);
      expect(res.body.error).to.be.a('string');
      return done();
    });
  });
  it('should return an error status code 422 if the email field is left empty', function (done) {
    _chai.default.request(_server.default).post('/api/v1/auth/login').send({
      email: '',
      password: 'Qwertyuiop1?'
    }).end(function (err, res) {
      if (err) return done(err);
      expect(res.status).to.equal(422);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.all.keys('status', 'error');
      expect(res.body).to.haveOwnProperty('status').that.equals(422);
      expect(res.body.error).to.be.a('string');
      return done();
    });
  });
  it('should return an error status code 422 if the password does not meet the needed requirement', function (done) {
    _chai.default.request(_server.default).post('/api/v1/auth/login').send({
      email: 'james@yahoo.com',
      password: 'qwertyuiop1?'
    }).end(function (err, res) {
      if (err) return done(err);
      expect(res.status).to.equal(422);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.all.keys('status', 'error');
      expect(res.body).to.haveOwnProperty('status').that.equals(422);
      expect(res.body.error).to.be.a('string');
      return done();
    });
  });
  it('should return an error status code 422 if the password field is empty', function (done) {
    _chai.default.request(_server.default).post('/api/v1/auth/login').send({
      email: 'james@yahoo.com',
      password: ''
    }).end(function (err, res) {
      if (err) return done(err);
      expect(res.status).to.equal(422);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.all.keys('status', 'error');
      expect(res.body).to.haveOwnProperty('status').that.equals(422);
      expect(res.body.error).to.be.a('string');
      return done();
    });
  });
  it('should return an error status code 422 if the email field is invalid - PASSWORD RESET ENDPOINT', function (done) {
    _chai.default.request(_server.default).post('/api/v1/auth/reset').send({
      email: 'jamesyahoo.com'
    }).end(function (err, res) {
      if (err) return done(err);
      expect(res.status).to.equal(422);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.all.keys('status', 'error');
      expect(res.body).to.haveOwnProperty('status').that.equals(422);
      expect(res.body.error).to.be.a('string');
      return done();
    });
  });
  it('should return an error status code 422 if the email field is empty - PASSWORD RESET ENDPOINT', function (done) {
    _chai.default.request(_server.default).post('/api/v1/auth/reset').send({
      email: ''
    }).end(function (err, res) {
      if (err) return done(err);
      expect(res.status).to.equal(422);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.all.keys('status', 'error');
      expect(res.body).to.haveOwnProperty('status').that.equals(422);
      expect(res.body.error).to.be.a('string');
      return done();
    });
  });
});
describe('Testing Message Endpoints Validators', function () {
  before(function (done) {
    _chai.default.request(_server.default).post('/api/v1/messages').set('Authorization', "Bearer ".concat(testToken)).send({
      subject: 'Are you Ready',
      message: 'Chelsea is coming to town!!!!!!!',
      email: 'ifeanyi@yahoo.com'
    }).end(function (err, res) {
      if (err) return done(err);
      done();
    });
  });
  before(function (done) {
    _chai.default.request(_server.default).post('/api/v1/messages').set('Authorization', "Bearer ".concat(testToken)).send({
      subject: 'Integration test alert !!!!!!!!!',
      message: 'We are running an integrated tests on our endpoints',
      email: 'ifeanyi@yahoo.com'
    }).end(function (err, res) {
      if (err) return done(err);
      done();
    });
  });
  it('should return an error status code 422 when an invalid email is supplied', function (done) {
    _chai.default.request(_server.default).post('/api/v1/messages').set('Authorization', "Bearer ".concat(testToken)).send({
      subject: 'Are you Available',
      message: 'Can we meetup at 5pm?',
      email: 'ifeanyiyahoo.com'
    }).end(function (err, res) {
      if (err) return done(err);
      expect(res.status).to.equal(422);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.all.keys('status', 'error');
      expect(res.body).to.haveOwnProperty('status').that.equals(422);
      expect(res.body.error).to.be.a('string');
      done();
    });
  });
  it('should return an error status code 422 when the message field is left empty', function (done) {
    _chai.default.request(_server.default).post('/api/v1/messages').set('Authorization', "Bearer ".concat(testToken)).send({
      subject: 'Are you Available',
      message: '',
      email: 'ifeanyi@yahoo.com'
    }).end(function (err, res) {
      if (err) return done(err);
      expect(res.status).to.equal(422);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.all.keys('status', 'error');
      expect(res.body).to.haveOwnProperty('status').that.equals(422);
      expect(res.body.error).to.be.a('string');
      done();
    });
  });
  it('should return an error status code 422 when the subject field is left empty', function (done) {
    _chai.default.request(_server.default).post('/api/v1/messages').set('Authorization', "Bearer ".concat(testToken)).send({
      subject: '',
      message: 'Can we meetup at 5pm?',
      email: 'ifeanyi@yahoo.com'
    }).end(function (err, res) {
      if (err) return done(err);
      expect(res.status).to.equal(422);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.all.keys('status', 'error');
      expect(res.body).to.haveOwnProperty('status').that.equals(422);
      expect(res.body.error).to.be.a('string');
      done();
    });
  });
  it('should return an error status code 422 when the email field is left empty', function (done) {
    _chai.default.request(_server.default).post('/api/v1/messages').set('Authorization', "Bearer ".concat(testToken)).send({
      subject: 'Are you Available',
      message: 'Can we meetup at 5pm?',
      email: ''
    }).end(function (err, res) {
      if (err) return done(err);
      expect(res.status).to.equal(422);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.all.keys('status', 'error');
      expect(res.body).to.haveOwnProperty('status').that.equals(422);
      expect(res.body.error).to.be.a('string');
      done();
    });
  });
});
describe('Testing GROUP Endpoints Validators', function () {
  before(function (done) {
    _chai.default.request(_server.default).post('/api/v1/groups').set('Authorization', "Bearer ".concat(testToken)).send({
      name: 'My validator group 1'
    }).end(function (err, res) {
      if (err) return done(err);
      done();
    });
  });
  before(function (done) {
    _chai.default.request(_server.default).post('/api/v1/groups').set('Authorization', "Bearer ".concat(testToken)).send({
      name: 'My validator group 2!!'
    }).end(function (err, res) {
      if (err) return done(err);
      done();
    });
  });
  before(function (done) {
    _chai.default.request(_server.default).post('/api/v1/groups').set('Authorization', "Bearer ".concat(testToken)).send({
      name: 'My validator group 3!!!!!!'
    }).end(function (err, res) {
      if (err) return done(err);
      done();
    });
  });
  it('should return an error status code 422 when the new group name field is left empty- CREATE NEW GROUP ENDPOINT', function (done) {
    _chai.default.request(_server.default).post('/api/v1/groups').set('Authorization', "Bearer ".concat(testToken)).send({
      name: ''
    }).end(function (err, res) {
      if (err) return done(err);
      expect(res.status).to.equal(422);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.all.keys('status', 'error');
      expect(res.body).to.haveOwnProperty('status').that.equals(422);
      expect(res.body.error).to.be.a('string');
      done();
    });
  });
  it('should return an error status code 422 when the new group name characters are less than 5 - CREATE NEW GROUP ENDPOINT', function (done) {
    _chai.default.request(_server.default).post('/api/v1/groups').set('Authorization', "Bearer ".concat(testToken)).send({
      name: 'Hey'
    }).end(function (err, res) {
      if (err) return done(err);
      expect(res.status).to.equal(422);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.all.keys('status', 'error');
      expect(res.body).to.haveOwnProperty('status').that.equals(422);
      expect(res.body.error).to.be.a('string');
      done();
    });
  });
  it('should return an error status code 422 when the group name characters are less than 5 - CHANGE GROUP NAME ENDPOINT', function (done) {
    _chai.default.request(_server.default).patch('/api/v1/groups/5/name').set('Authorization', "Bearer ".concat(testToken)).send({
      name: 'test'
    }).end(function (err, res) {
      if (err) return done(err);
      expect(res.status).to.equal(422);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.all.keys('status', 'error');
      expect(res.body).to.haveOwnProperty('status').that.equals(422);
      expect(res.body.error).to.be.a('string');
      done();
    });
  });
  it('should return an error status code 422 when the group name change field is empty- CHANGE GROUP NAME ENDPOINT', function (done) {
    _chai.default.request(_server.default).patch('/api/v1/groups/5/name').set('Authorization', "Bearer ".concat(testToken)).send({
      name: ''
    }).end(function (err, res) {
      if (err) return done(err);
      expect(res.status).to.equal(422);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.all.keys('status', 'error');
      expect(res.body).to.haveOwnProperty('status').that.equals(422);
      expect(res.body.error).to.be.a('string');
      done();
    });
  });
  it('should return an error status code 422 when the new group member\'s email field is empty- ADD NEW USER TO GROUP ENDPOINT', function (done) {
    _chai.default.request(_server.default).post('/api/v1/groups/5/users/').set('Authorization', "Bearer ".concat(testToken)).send({
      email: ''
    }).end(function (err, res) {
      if (err) return done(err);
      expect(res.status).to.equal(422);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.all.keys('status', 'error');
      expect(res.body).to.haveOwnProperty('status').that.equals(422);
      expect(res.body.error).to.be.a('string');
      done();
    });
  });
  it('should return an error status code 422 when the new group member\'s email is invalid- ADD NEW USER TO GROUP ENDPOINT', function (done) {
    _chai.default.request(_server.default).post('/api/v1/groups/5/users/').set('Authorization', "Bearer ".concat(testToken)).send({
      email: 'ucheyahoo.com'
    }).end(function (err, res) {
      if (err) return done(err);
      expect(res.status).to.equal(422);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.all.keys('status', 'error');
      expect(res.body).to.haveOwnProperty('status').that.equals(422);
      expect(res.body.error).to.be.a('string');
      done();
    });
  });
  it('should return an error status code 422 when an the mail-subject field is left empty - NEW GROUP MESSAGE ENDPOINT', function (done) {
    _chai.default.request(_server.default).post('/api/v1/groups/1/messages').set('Authorization', "Bearer ".concat(testToken)).send({
      subject: '',
      message: 'Can we meetup at 5pm?'
    }).end(function (err, res) {
      if (err) return done(err);
      expect(res.status).to.equal(422);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.all.keys('status', 'error');
      expect(res.body).to.haveOwnProperty('status').that.equals(422);
      expect(res.body.error).to.be.a('string');
      done();
    });
  });
  it('should return an error status code 422 when an the new mail-message field is left empty - NEW GROUP MESSAGE ENDPOINT', function (done) {
    _chai.default.request(_server.default).post('/api/v1/groups/1/messages').set('Authorization', "Bearer ".concat(testToken)).send({
      subject: 'Are you home?',
      message: ''
    }).end(function (err, res) {
      if (err) return done(err);
      expect(res.status).to.equal(422);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.all.keys('status', 'error');
      expect(res.body).to.haveOwnProperty('status').that.equals(422);
      expect(res.body.error).to.be.a('string');
      done();
    });
  });
});