process.env.NODE_ENV = 'test';


let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');

let APIService = require('../data/API.service')();

let should = chai.should();

chai.use(chaiHttp);

describe('APIs', () => {

    // to begin each test with empty db, remove all elemnts each time before the test run
    beforeEach((done) => {
        APIService.removeAll().then(function() { 
           done();         
        });     
    });

    describe('/GET', () => {
        it('it should GET all the APIs with empty db', (done) => {
            chai.request(server.app)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
              done();
            });
        });
        it('it should get multiple API values', (done) => {
            let API1 = {
                id    : "foo",
                name  : "Configuration for Foo",
                value : "This is the value for configuration Foo",
            }
            let API2 = {
                id    : "bar",
                name  : "Configuration for Boo",
                value : "This is the value for configuration Boo",
            }
            APIService.add(API1).then(function () {
                APIService.add(API2).then(function () {
                    chai.request(server.app)
                    .get('/')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.length.should.be.eql(2);
                        res.body[0].should.have.property('id').eql(API1.id);
                        res.body[0].should.have.property('name').eql(API1.name);
                        res.body[0].should.have.property('value').eql(API1.value);
                        res.body[1].should.have.property('id').eql(API2.id);
                        res.body[1].should.have.property('name').eql(API2.name);
                        res.body[1].should.have.property('value').eql(API2.value);
                        done();
                    });
                });
            });
        });
        it('it should not GET an API with wrong id', (done) => {
            chai.request(server.app)
            .get('/foo')
            .end((err, res) => {
                res.should.have.status(400);               
                res.text.should.be.eql('id not found');
                done();
            });
        });
        it('it should get an API by id', (done) => {
            let API = {
                id    : "foo",
                name  : "Configuration for Foo",
                value : "This is the value for configuration Foo",
            }
            let path = API.id+'?param1=ignoredvalue';
            APIService.add(API).then(function () {
                chai.request(server.app)
                .get('/'+path)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('id').eql(API.id);
                    res.body.should.have.property('name').eql(API.name);
                    res.body.should.have.property('value').eql(API.value);
                    done();
                });
            });
        });
    });
    describe('/POST', () => {
        it('it should not POST a new API due to missing id', (done) => {
            chai.request(server.app)
            .post('/')
            .end((err, res) => {
                res.should.have.status(400);
                res.text.should.be.eql('id required');
                done();
            });
        });
        it('it should not POST beacause the id is already defined', (done) => {
            let API = {
                id    : "foo/foo",
                name  : "Configuration for Foo",
                value : "This is the value for configuration Foo",
            }

            APIService.add(API).then(function () {
                chai.request(server.app)
                .post('/'+API.id)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.text.should.be.eql('id already taken');
                    done();
                });
            });
        });
        it('it should POST a new API', (done) => {
            let API = {
                name  : "Configuration for Foo",
                value : "This is the value for configuration Foo",
            }
            chai.request(server.app)
            .post('/foo')
            .send(API)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('id').eql("foo");
                res.body.should.have.property('name').eql(API.name);
                res.body.should.have.property('value').eql(API.value);
                done();
            });
        });
    });

    describe('/PUT', () => {
        it('it should UPDATE an API configuration given the id', (done) => {
        let API = {
            id    : "foo",
            name  : "Configuration for Foo",
            value : "This is the value for configuration Foo",
        }

        let updatedAPI = {
            name  : "new Name",
            value : "This is the value for configuration Foo",
        }
        APIService.add(API).then(function () {
                chai.request(server.app)
                .put('/foo')
                .send(updatedAPI)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('name').eql(updatedAPI.name);
                    res.body.should.have.property('value').eql(updatedAPI.value);
                    done();
                });
            });
        });
  });

  describe('/DELETE', () => {
      it('it should DELETE an API configuration given an id', (done) => {
        let API = {
            id    : "foo",
            name  : "Configuration for Foo",
            value : "This is the value for configuration Foo"  };

        APIService.add(API).then(function () {
                chai.request(server.app)
                .delete('/'+API.id)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('id').eql(API.id);
                    res.body.should.have.property('name').eql(API.name);
                    res.body.should.have.property('value').eql(API.value);
                    done();
                });
            });
        });
    });
});