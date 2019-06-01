import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import server from '../src/server';

dotenv.config();


const { expect } = chai;
chai.use(chaiHttp);

const testUser3 = {
  email: 'james@yahoo.com',
  firstName: 'james',
  lastName: 'awarga',
  password: 'Qwertyuiop1?',
  username: 'jamie',
  recoveryEmail: 'james@gmail.com'
};
const testUser4 = {
  email: 'ifeanyi@yahoo.com',
  firstName: 'ifeanyi',
  lastName: 'okorie',
  password: 'Qwertyuiop1',
  username: 'ify',
  recoveryEmail: 'ify@gmail.com'
};
const testUser5 = {
  email: 'emmayahoo.com',
  firstName: 'Emmanuel',
  lastName: 'Lawrence',
  password: 'Qwertyuiop1?',
  username: 'emma',
  recoveryEmail: 'emma@gmail.com'
};
let testToken = null;

describe('Testing User SIGNUP/LOGIN and PASSWORD RESET validators', () => {
  before((done) => {
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(testUser3)
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });
  before((done) => {
    chai.request(server)
      .post('/api/v1/auth/login')
      .send({
        email: 'james@yahoo.com',
        password: 'Qwertyuiop1?'
      })
      .end((err, res) => {
        testToken = res.headers.authorization;
        if (err) return done(err);
        return done();
      });
  });
  it('should return an error status code 422 if the password is invalid - NEW USER ENDPOINT', (done) => {
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(testUser4)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.haveOwnProperty('status');
        expect(res.status).to.equal(422);
        expect((res.body)).to.be.an('object');
        expect((res.body)).to.have.all.keys('status', 'error');
        expect((res.body)).to.haveOwnProperty('status').that.equals(422);
        expect((res.body)).to.haveOwnProperty('error').that.is.a('string');
        expect((res.body.error)).to.be.a('string');
        return done();
      });
  });
  it('should return an error status code 422 if the email is invalid - NEW USER ENDPOINT', (done) => {
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(testUser5)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.haveOwnProperty('status');
        expect(res.status).to.equal(422);
        expect((res.body)).to.be.an('object');
        expect((res.body)).to.have.all.keys('status', 'error');
        expect((res.body)).to.haveOwnProperty('status').that.equals(422);
        expect((res.body)).to.haveOwnProperty('error').that.is.a('string');
        expect((res.body.error)).to.be.a('string');
        return done();
      });
  });
  it('should return an error status code 422 if the email is invalid - USER LOGIN ENDPOINT', (done) => {
    chai.request(server)
      .post('/api/v1/auth/login')
      .send({
        email: 'jame',
        password: 'Qwertyuiop1?'
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(422);
        expect((res.body)).to.be.an('object');
        expect((res.body)).to.have.all.keys('status', 'error');
        expect((res.body)).to.haveOwnProperty('status').that.equals(422);
        expect((res.body.error)).to.be.a('string');
        return done();
      });
  });
  it('should return an error status code 422 if the email field is left empty', (done) => {
    chai.request(server)
      .post('/api/v1/auth/login')
      .send({
        email: '',
        password: 'Qwertyuiop1?'
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(422);
        expect((res.body)).to.be.an('object');
        expect((res.body)).to.have.all.keys('status', 'error');
        expect((res.body)).to.haveOwnProperty('status').that.equals(422);
        expect((res.body.error)).to.be.a('string');
        return done();
      });
  });
  it('should return an error status code 422 if the password does not meet the needed requirement', (done) => {
    chai.request(server)
      .post('/api/v1/auth/login')
      .send({
        email: 'james@yahoo.com',
        password: 'qwertyuiop1?'
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(422);
        expect((res.body)).to.be.an('object');
        expect((res.body)).to.have.all.keys('status', 'error');
        expect((res.body)).to.haveOwnProperty('status').that.equals(422);
        expect((res.body.error)).to.be.a('string');
        return done();
      });
  });
  it('should return an error status code 422 if the password field is empty', (done) => {
    chai.request(server)
      .post('/api/v1/auth/login')
      .send({
        email: 'james@yahoo.com',
        password: ''
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(422);
        expect((res.body)).to.be.an('object');
        expect((res.body)).to.have.all.keys('status', 'error');
        expect((res.body)).to.haveOwnProperty('status').that.equals(422);
        expect((res.body.error)).to.be.a('string');
        return done();
      });
  });
  it('should return an error status code 422 if the email field is invalid - PASSWORD RESET ENDPOINT', (done) => {
    chai.request(server)
      .post('/api/v1/auth/reset')
      .send({
        email: 'jamesyahoo.com'
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(422);
        expect((res.body)).to.be.an('object');
        expect((res.body)).to.have.all.keys('status', 'error');
        expect((res.body)).to.haveOwnProperty('status').that.equals(422);
        expect((res.body.error)).to.be.a('string');
        return done();
      });
  });
  it('should return an error status code 422 if the email field is empty - PASSWORD RESET ENDPOINT', (done) => {
    chai.request(server)
      .post('/api/v1/auth/reset')
      .send({
        email: ''
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(422);
        expect((res.body)).to.be.an('object');
        expect((res.body)).to.have.all.keys('status', 'error');
        expect((res.body)).to.haveOwnProperty('status').that.equals(422);
        expect((res.body.error)).to.be.a('string');
        return done();
      });
  });
});

describe('Testing Message Endpoints Validators', () => {
  before((done) => {
    chai.request(server)
      .post('/api/v1/messages')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        subject: 'Are you Ready',
        message: 'Chelsea is coming to town!!!!!!!',
        email: 'ifeanyi@yahoo.com'
      })
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
  before((done) => {
    chai.request(server)
      .post('/api/v1/messages')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        subject: 'Integration test alert !!!!!!!!!',
        message: 'We are running an integrated tests on our endpoints',
        email: 'ifeanyi@yahoo.com'
      })
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
  it('should return an error status code 422 when an invalid email is supplied', (done) => {
    chai.request(server)
      .post('/api/v1/messages')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        subject: 'Are you Available',
        message: 'Can we meetup at 5pm?',
        email: 'ifeanyiyahoo.com'
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(422);
        expect((res.body)).to.be.an('object');
        expect((res.body)).to.have.all.keys('status', 'error');
        expect((res.body)).to.haveOwnProperty('status').that.equals(422);
        expect((res.body.error)).to.be.a('string');
        done();
      });
  });
  it('should return an error status code 422 when the message field is left empty', (done) => {
    chai.request(server)
      .post('/api/v1/messages')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        subject: 'Are you Available',
        message: '',
        email: 'ifeanyi@yahoo.com'
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(422);
        expect((res.body)).to.be.an('object');
        expect((res.body)).to.have.all.keys('status', 'error');
        expect((res.body)).to.haveOwnProperty('status').that.equals(422);
        expect((res.body.error)).to.be.a('string');
        done();
      });
  });
  it('should return an error status code 422 when the subject field is left empty', (done) => {
    chai.request(server)
      .post('/api/v1/messages')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        subject: '',
        message: 'Can we meetup at 5pm?',
        email: 'ifeanyi@yahoo.com'
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(422);
        expect((res.body)).to.be.an('object');
        expect((res.body)).to.have.all.keys('status', 'error');
        expect((res.body)).to.haveOwnProperty('status').that.equals(422);
        expect((res.body.error)).to.be.a('string');
        done();
      });
  });
  it('should return an error status code 422 when the email field is left empty', (done) => {
    chai.request(server)
      .post('/api/v1/messages')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        subject: 'Are you Available',
        message: 'Can we meetup at 5pm?',
        email: ''
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(422);
        expect((res.body)).to.be.an('object');
        expect((res.body)).to.have.all.keys('status', 'error');
        expect((res.body)).to.haveOwnProperty('status').that.equals(422);
        expect((res.body.error)).to.be.a('string');
        done();
      });
  });
});

describe('Testing GROUP Endpoints Validators', () => {
  before((done) => {
    chai.request(server)
      .post('/api/v1/groups')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        name: 'My validator group 1'
      })
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
  before((done) => {
    chai.request(server)
      .post('/api/v1/groups')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        name: 'My validator group 2!!'
      })
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
  before((done) => {
    chai.request(server)
      .post('/api/v1/groups')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        name: 'My validator group 3!!!!!!'
      })
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });


  it('should return an error status code 422 when the new group name field is left empty- CREATE NEW GROUP ENDPOINT', (done) => {
    chai.request(server)
      .post('/api/v1/groups')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        name: ''
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(422);
        expect((res.body)).to.be.an('object');
        expect((res.body)).to.have.all.keys('status', 'error');
        expect((res.body)).to.haveOwnProperty('status').that.equals(422);
        expect((res.body.error)).to.be.a('string');
        done();
      });
  });
  it('should return an error status code 422 when the new group name characters are less than 5 - CREATE NEW GROUP ENDPOINT', (done) => {
    chai.request(server)
      .post('/api/v1/groups')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        name: 'Hey'
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(422);
        expect((res.body)).to.be.an('object');
        expect((res.body)).to.have.all.keys('status', 'error');
        expect((res.body)).to.haveOwnProperty('status').that.equals(422);
        expect((res.body.error)).to.be.a('string');
        done();
      });
  });
  it('should return an error status code 422 when the group name characters are less than 5 - CHANGE GROUP NAME ENDPOINT', (done) => {
    chai.request(server)
      .patch('/api/v1/groups/5/name')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        name: 'test'
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(422);
        expect((res.body)).to.be.an('object');
        expect((res.body)).to.have.all.keys('status', 'error');
        expect((res.body)).to.haveOwnProperty('status').that.equals(422);
        expect((res.body.error)).to.be.a('string');
        done();
      });
  });
  it('should return an error status code 422 when the group name change field is empty- CHANGE GROUP NAME ENDPOINT', (done) => {
    chai.request(server)
      .patch('/api/v1/groups/5/name')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        name: ''
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(422);
        expect((res.body)).to.be.an('object');
        expect((res.body)).to.have.all.keys('status', 'error');
        expect((res.body)).to.haveOwnProperty('status').that.equals(422);
        expect((res.body.error)).to.be.a('string');
        done();
      });
  });
  it('should return an error status code 422 when the new group member\'s email field is empty- ADD NEW USER TO GROUP ENDPOINT', (done) => {
    chai.request(server)
      .post('/api/v1/groups/5/users/')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        email: ''
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(422);
        expect((res.body)).to.be.an('object');
        expect((res.body)).to.have.all.keys('status', 'error');
        expect((res.body)).to.haveOwnProperty('status').that.equals(422);
        expect((res.body.error)).to.be.a('string');
        done();
      });
  });
  it('should return an error status code 422 when the new group member\'s email is invalid- ADD NEW USER TO GROUP ENDPOINT', (done) => {
    chai.request(server)
      .post('/api/v1/groups/5/users/')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        email: 'ucheyahoo.com'
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(422);
        expect((res.body)).to.be.an('object');
        expect((res.body)).to.have.all.keys('status', 'error');
        expect((res.body)).to.haveOwnProperty('status').that.equals(422);
        expect((res.body.error)).to.be.a('string');
        done();
      });
  });
  it('should return an error status code 422 when an the mail-subject field is left empty - NEW GROUP MESSAGE ENDPOINT', (done) => {
    chai.request(server)
      .post('/api/v1/groups/1/messages')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        subject: '',
        message: 'Can we meetup at 5pm?'
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(422);
        expect((res.body)).to.be.an('object');
        expect((res.body)).to.have.all.keys('status', 'error');
        expect((res.body)).to.haveOwnProperty('status').that.equals(422);
        expect((res.body.error)).to.be.a('string');
        done();
      });
  });
  it('should return an error status code 422 when an the new mail-message field is left empty - NEW GROUP MESSAGE ENDPOINT', (done) => {
    chai.request(server)
      .post('/api/v1/groups/1/messages')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        subject: 'Are you home?',
        message: ''
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(422);
        expect((res.body)).to.be.an('object');
        expect((res.body)).to.have.all.keys('status', 'error');
        expect((res.body)).to.haveOwnProperty('status').that.equals(422);
        expect((res.body.error)).to.be.a('string');
        done();
      });
  });
});
