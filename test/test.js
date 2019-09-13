const expect = require('chai').expect;

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();

chai.use(chaiHttp);

//==================== API test ====================

describe('/ server running test', () => {
  it('it should visit the server running on http://localhost:3000 ', (done) => {
    chai.request(server)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
  });
});

describe('/api', () => {
  it('it should response /api ', (done) => {
    chai.request(server)
        .get('/api')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.message.should.be.a('string');
          res.body.should.have.property('message');
          done();
        });
  });
});

describe('/api/configs', () => {
  it('it should return all configs of sites ', (done) => {
    chai.request(server)
        .get('/api/configs')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body[0].should.have.property('name');
          res.body[0].should.have.property('uri');
          res.body[0].should.have.property('config');
          res.body[0].should.have.property('tags');
          res.body[0].should.have.property('content_type');
          res.body[0].should.have.property('state');
          res.body[0].should.have.property('schedule');
          res.body[0].should.have.property('ts');
          done();
        });
  });

  it('it should return a config of sample url ', (done) => {
    let url = 'https://wildbit.com/jobs';
    chai.request(server)
        .get('/api/configs')
        .query({url: url})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('name');
          res.body.should.have.property('uri');
          res.body.should.have.property('config');
          res.body.should.have.property('tags');
          res.body.should.have.property('content_type');
          res.body.should.have.property('state');
          res.body.should.have.property('schedule');
          res.body.should.have.property('ts');
          done();
        });
  });
});