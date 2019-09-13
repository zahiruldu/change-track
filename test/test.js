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