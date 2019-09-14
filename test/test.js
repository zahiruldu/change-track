const expect = require('chai').expect;
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();

chai.use(chaiHttp);

//==================== API tests ====================

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

describe('/api/rules', () => {
  it('it should return all rules of sites ', (done) => {
    chai.request(server)
        .get('/api/rules')
        .end((err, res) => {
          res.should.have.status(200);
          let config = res.body;
          config.should.be.a('array');
          config[0].should.be.a('object');
          config[0].should.have.property('selections');
          config[0].should.have.property('ignoreEmptyText');
          config[0].should.have.property('includeStyle');
          config[0].should.have.property('dataAttr');
          config[0].selections.should.be.a('array');
          done();
        });
  });

  it('it should return a rule of sample url config', (done) => {
    let url = 'https://wildbit.com/jobs';
    chai.request(server)
        .get('/api/rules')
        .query({url: url})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('selections');
          res.body.should.have.property('ignoreEmptyText');
          res.body.should.have.property('includeStyle');
          res.body.should.have.property('dataAttr');
          res.body.selections.should.be.a('array');
          done();
        });
  });
});


describe('/api/status', () => {
  it('it should return message "url is missing!" ', (done) => {
    chai.request(server)
        .get('/api/status')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          expect(res.body.message).to.be.a('string');
          expect(res.body.message).to.equal('url is missing!');
          done();
        });
  });

  it('it should return message "config not found for this url" when unkwon url sent', (done) => {
    let url = 'https://wildbit.com/jobss';
    chai.request(server)
        .get('/api/status')
        .query({url: url})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          expect(res.body.message).to.be.a('string');
          expect(res.body.message).to.equal('config not found for this url');
          done();
        });
  });

  it('it should return changesets  data of a valid url', function(done) {
    this.timeout(10000);
  
    let url = 'https://wildbit.com/jobs';
    chai.request(server)
        .get('/api/status')
        .query({url: url})
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

          res.body[0].config.should.be.a('object');
          res.body[0].config.should.have.property('selections');
          res.body[0].config.should.have.property('ignoreEmptyText');
          res.body[0].config.should.have.property('includeStyle');
          res.body[0].config.should.have.property('dataAttr');
          res.body[0].config.selections.should.be.a('array');
          done();
        });
  });
});


describe('/jobs', () => {
  it('it should retrun all the chnagessets of all urls ', (done) => {
    chai.request(server)
        .get('/api/jobs')
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
});
