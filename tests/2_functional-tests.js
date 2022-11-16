var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
     
      test('Create an issue with every field', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          expect(err).to.be.null;
          assert.equal(res.status, 201);
          assert.property(res.body, 'issue_title');
          assert.property(res.body, 'issue_text');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'updated_on');
          assert.property(res.body, 'created_by');
          assert.property(res.body, 'assigned_to');
          assert.property(res.body, 'open');
          assert.property(res.body, 'status_text');
          assert.property(res.body, '_id');
          done();
        });
      });
               
      test('Create an issue with only required fields', function(done) {
        chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'Text1',
          created_by: 'Functional Test - Required fields filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          expect(err).to.be.null;
          assert.equal(res.status, 201);
          assert.isNull(err, 'there was no error');
          assert.exists(res.body.issue_title, 'issue_title is neither `null` nor `undefined`');
          assert.exists(res.body.issue_text, 'issue_text is neither `null` nor `undefined`');
          assert.exists(res.body.created_by, 'created_by is neither `null` nor `undefined`');
          assert.isNotEmpty('issue_title');
          assert.isNotEmpty('issue_text');
          assert.isNotEmpty('created_by');
          done();
        });
      });
   
      test('Create an issue with missing required fields', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
              issue_title: 'Title',
              issue_text: 'issue',
              created_by: '',
              assigned_to: 'Chai and Mocha',
              status_text: 'Text1'
          })
          .end(function(err, res) {            
            assert.equal(res.status, 200);
            assert.equal(res.text, '{"error":"required field(s) missing"}', '== error is missing inputs')         
            done();
          })
      });
      
    });


  suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('View issues on a project', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });      
      
      test('View issues on a project with one filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        ////// .query({assigned_to:"chai and mocha"})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('View issues on a project with multiple filters', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        ////// .query({assigned_to:"chai and mocha", status_text:"In QA", issue_title:"Title"})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
    });
      
    suite('PUT /api/issues/{project} => text', function() {
      
      test('Update one field on an issue', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: '637493a7c248dd2617cb052a',
          created_by: "functional test - One field to update"
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, '{"result":"successfully updated","_id":"637493a7c248dd2617cb052a"}', '== successfully updated') 
          done();
        });
      });   

      test('Update multiple fields on an issue', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: '637493a7c248dd2617cb052a',
          created_by: "functional test - Multiple fields to update",
          assigned_to: "bob"
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, '{"result":"successfully updated","_id":"637493a7c248dd2617cb052a"}', '== successfully updated') 
          done();
        });
      });


      test('Update an issue with missing _id', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
          created_by: "functional test - Multiple fields to update",
          assigned_to: "bob"
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, '{"error":"missing _id"}', '== no updated field sent') //// Error
          done();
        });        
      });   
      
     test('Update an issue with no fields to update', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: '637493a7c248dd2617cb052a'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, '{"error":"no update field(s) sent","_id":"637493a7c248dd2617cb052a"}', '== no updated field sent') 
          done();
        });        
      });   

      test('Update an issue with an invalid _id', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: '637493a7c248dd2617cb052X'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, '{"error":"no update field(s) sent","_id":"637493a7c248dd2617cb052X"}', '== no updated field sent') /// Error
          done();
        });        
      }); 

      
    });
  
   
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('Delete an issue', function(done) {
          chai.request(server)
            .post('/api/issues/test')
            .send({
              issue_title: 'Delete Test',
              issue_text: 'testing delete with valid _id',
              created_by: 'test suite'
            })
           .end(function(err,res){
            var _idToDelete = res.body._id;
            chai.request(server)
              .delete('/api/issues/test')
              .send({_id: _idToDelete})
              .end(function(err,res){
                assert.equal(res.status, 200);
                assert.equal(res.text, `{"result":"successfully deleted","_id":"${_idToDelete}"}`);
                done();
              });
          });
      });

      test('Delete an issue with an invalid _id', function(done) {
        chai.request(server)
            .post('/api/issues/test')
            .send({
              _id: '637493a7c248dd2617cb052x',
            })           
            .end(function(err,res){
              assert.equal(res.status, 200);
              assert.equal(res.text, '{"error":"required field(s) missing"}'); //// Error
              done();
            });
      });   
      
      test('Delete an issue with missing _id', function(done) {
        chai.request(server)
            .post('/api/issues/test')
            .send({
              _id: null,
            })           
            .end(function(err,res){
              assert.equal(res.status, 200);
              assert.equal(res.text, '{"error":"required field(s) missing"}');
              done();
            });
      });        
         
      
    }); 
    

}); //Functional Tests

