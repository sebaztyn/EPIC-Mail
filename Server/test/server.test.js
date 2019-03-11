import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/server';

const { expect } = chai;
chai.use(chaiHttp);

// describe('Create API endpoints', () => {
//   it('it  should return specific keys MESSAGE and STATUS when the User database has no registered user', (done) => {
//     chai.request(server)
//       .get('/api/v1/users')
//       .end((err, res) => {
//         if (err) {
//           done(err);
//         }
//         expect(res.body).contain.keys('status', 'data');
//         done();
//       });
//   });
// });


describe('Testing endpoints', () => {
  it('It should post new user data to the database', (done) => {
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send({
        email: 'sebastinocj@yahoo.com',
        firstName: 'Chima',
        lastName: 'Ekeneme',
        password: 'klue',
        username: 'sebaztyn',
        recoveryEmail: 'sebastinechima@gmail.com'
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.haveOwnProperty('status');
        expect(res.status).to.equal(201);
        expect((res.body)).to.be.an('object');
        expect((res.body)).to.have.all.keys('status', 'data');
        expect((res.body)).to.haveOwnProperty('status').that.equals(201);
        expect((res.body)).to.haveOwnProperty('data').that.is.an('array');
        expect((res.body)).to.haveOwnProperty('data').that.is.an('array');
        expect((res.body.data)).to.be.an('array');
        expect((res.body.data[0])).to.be.an('object');
        expect((res.body.data[0])).to.haveOwnProperty('token');
        done();
      });
  });

  it('It allow user saved in the database access to the login page', (done) => {
    chai.request(server)
      .post('/api/v1/auth/login')
      .send({
        email: 'sebastinocj@yahoo.com',
        password: 'klue'
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body).to.haveOwnProperty('status').that.is.a('number');
        expect(res.body).to.haveOwnProperty('data').that.is.an('array');
        expect(res.body.data[0]).to.haveOwnProperty('token').that.is.an('string');
        done();
      });
  });
});

describe('Creating and Testing  API endpoint for Receiving Messages', () => {
  it('it  should return specific keys "allMessages and Status" when a call is made to all received messages', (done) => {
    chai.request(server)
      .get('/api/v1/messages')
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body).to.have.keys('status', 'data');
        expect(res.body).to.have.ownProperty('status').that.equals(201);
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


describe('Fetching all unread Messages', () => {
  it('it  should return specific value:UNREAD when a call is made to all received unread messages', (done) => {
    chai.request(server)
      .get('/api/v1/messages/unread')
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body).to.have.keys('status', 'data');
        expect(res.body).to.have.ownProperty('status').that.equals(201);
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
describe('Fetching all sent Messages', () => {
  it('it  should return specific value:SENT when a call is made to all sent messages', (done) => {
    chai.request(server)
      .get('/api/v1/messages/sent')
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body).to.have.keys('status', 'data');
        expect(res.body).to.have.ownProperty('status').that.equals(201);
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
describe('Fetching a specific Message', () => {
  it('it  should return a unique message matching the ID of the searched Message', (done) => {
    chai.request(server)
      .get('/api/v1/messages/2')
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body).to.have.keys('status', 'data');
        expect(res.body).to.have.ownProperty('status').that.equals(201);
        expect(res.body).to.have.ownProperty('data').to.be.an('object');
        expect(res.body.data.subject).to.be.a('string');
        expect(res.body.data.message).to.be.a('string');
        expect(res.body.data.id).to.be.a('number');
        expect(res.body.data.status).to.be.a('string');
        expect(res.body.data.parentMessageId).to.be.a('number');
        done();
      });
  });
});
describe('Deleting a specific Message', () => {
  it('it  should return a unique matching the ID of the deleted Message', (done) => {
    chai.request(server)
      .delete('/api/v1/messages/2')
      .end((err, res) => {
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

describe('Creating a Message', () => {
  it('It should post user Message to the database', (done) => {
    chai.request(server)
      .post('/api/v1/messages')
      .send({
        subject: 'Are you Available',
        message: 'Can we meetup at 5pm?',
        parentMessageId: 17,
        senderId: 1
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.haveOwnProperty('status');
        expect(res.body).to.haveOwnProperty('status').that.is.a('number');
        expect(res.body).to.haveOwnProperty('data');
        expect(res.body).to.haveOwnProperty('data').that.is.an('object');
        expect(res.status).to.equal(200);
        expect((res.body)).to.be.an('object');
        expect((res.body)).to.have.all.keys('status', 'data');
        expect((res.body)).to.haveOwnProperty('status').that.equals(201);
        expect((res.body)).to.haveOwnProperty('data').that.is.an('object');
        done();
      });
  });
});
