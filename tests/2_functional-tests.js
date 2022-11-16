var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var server = require('../server');

chai.use(chaiHttp);

function checkBody(el) {
    assert.property(el, 'issue_title');
    assert.property(el, 'issue_text');
    assert.property(el, 'created_on');
    assert.property(el, 'updated_on');
    assert.property(el, 'created_by');
    assert.property(el, 'assigned_to');
    assert.property(el, 'open');
    assert.property(el, 'status_text');
    assert.property(el, '_id');
}

suite('Functional Tests', function () {
    suite('POST /api/issues/{project} => object with issue data', function () {
        test('Create an issue with every field', function (done) {
            chai.request(server)
                .post('/api/issues/test')
                .send({
                    issue_title: 'Title',
                    issue_text: 'text',
                    created_by: 'Functional Test - Every field filled in',
                    assigned_to: 'Chai and Mocha',
                    status_text: 'In QA',
                })
                .end(function (err, res) {
                    expect(err).to.be.null;
                    assert.equal(res.status, 201);
                    checkBody(res.body);
                    done();
                });
        });

        test('Create an issue with only required fields', function (done) {
            chai.request(server)
                .post('/api/issues/test')
                .send({
                    issue_title: 'Title',
                    issue_text: 'Text1',
                    created_by: 'Functional Test - Required fields filled in',
                    assigned_to: 'Chai and Mocha',
                    status_text: 'In QA',
                })
                .end(function (err, res) {
                    expect(err).to.be.null;
                    assert.equal(res.status, 201);
                    assert.isNull(err, 'there was no error');
                    assert.exists(
                        res.body.issue_title,
                        'issue_title is neither `null` nor `undefined`'
                    );
                    assert.exists(
                        res.body.issue_text,
                        'issue_text is neither `null` nor `undefined`'
                    );
                    assert.exists(
                        res.body.created_by,
                        'created_by is neither `null` nor `undefined`'
                    );
                    assert.isNotEmpty('issue_title');
                    assert.isNotEmpty('issue_text');
                    assert.isNotEmpty('created_by');
                    done();
                });
        });

        test('Create an issue with missing required fields', function (done) {
            chai.request(server)
                .post('/api/issues/test')
                .send({
                    issue_title: 'Title',
                    issue_text: 'issue',
                    created_by: '',
                    assigned_to: 'Chai and Mocha',
                    status_text: 'Text1',
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(
                        res.text,
                        '{"error":"required field(s) missing"}',
                        '== error is missing inputs'
                    );
                    done();
                });
        });
    });

    suite(
        'GET /api/issues/{project} => Array of objects with issue data',
        function () {
            test('View issues on a project', function (done) {
                chai.request(server)
                    .get('/api/issues/test')
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.isArray(res.body);
                        res.body.forEach((el) => checkBody(el));
                        done();
                    });
            });

            test('View issues on a project with one filter', function (done) {
                chai.request(server)
                    .get('/api/issues/test')
                    .query({ assigned_to: 'Chai and Mocha' })
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.isArray(res.body);
                        res.body.forEach((el) => checkBody(el));
                        done();
                    });
            });

            test('View issues on a project with multiple filters', function (done) {
                chai.request(server)
                    .get('/api/issues/test')
                    .query({
                        assigned_to: 'Chai and Mocha',
                        status_text: 'In QA',
                        issue_title: 'Title',
                    })
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.isArray(res.body);
                        res.body.forEach((el) => checkBody(el));
                        done();
                    });
            });
        }
    );

    suite('PUT /api/issues/{project} => text', function () {
        test('Update one field on an issue', function (done) {
            chai.request(server)
                .post('/api/issues/test')
                .send({
                    issue_title: 'Update Test',
                    issue_text: 'testing update',
                    created_by: 'test suite',
                })
                .end(function (err, res) {
                    var _idToUpdate = res.body._id;
                    chai.request(server)
                        .put('/api/issues/test')
                        .send({
                            _id: _idToUpdate,
                            created_by: 'functional test - One field to update',
                        })
                        .end(function (err, res) {
                            assert.equal(res.status, 200);
                            assert.equal(
                                res.text,
                                `{"result":"successfully updated","_id":"${_idToUpdate}"}`,
                                '== successfully updated'
                            );
                            done();
                        });
                });
        });

        test('Update multiple fields on an issue', function (done) {
            chai.request(server)
                .post('/api/issues/test')
                .send({
                    issue_title: 'Update Test',
                    issue_text: 'testing update',
                    created_by: 'test suite',
                })
                .end(function (err, res) {
                    var _idToUpdate = res.body._id;
                    chai.request(server)
                        .put('/api/issues/test')
                        .send({
                            _id: _idToUpdate,
                            created_by: 'functional test - One field to update',
                            assigned_to: 'bob',
                        })
                        .end(function (err, res) {
                            assert.equal(res.status, 200);
                            assert.equal(
                                res.text,
                                `{"result":"successfully updated","_id":"${_idToUpdate}"}`,
                                '== successfully updated'
                            );
                            done();
                        });
                });
        });

        test('Update an issue with missing _id', function (done) {
            chai.request(server)
                .put('/api/issues/test')
                .send({
                    created_by: 'functional test - Multiple fields to update',
                    assigned_to: 'bob',
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(
                        res.text,
                        '{"error":"missing _id"}',
                        '== no updated field sent'
                    );
                    done();
                });
        });

        test('Update an issue with no fields to update', function (done) {
            chai.request(server)
                .put('/api/issues/test')
                .send({
                    _id: '637493a7c248dd2617cb052a',
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(
                        res.text,
                        '{"error":"no update field(s) sent","_id":"637493a7c248dd2617cb052a"}',
                        '== no updated field sent'
                    );
                    done();
                });
        });

        test('Update an issue with an invalid _id', function (done) {
            chai.request(server)
                .put('/api/issues/test')
                .send({
                    _id: '637493a7c248dd2617cb052X',
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(
                        res.text,
                        '{"error":"no update field(s) sent","_id":"637493a7c248dd2617cb052X"}',
                        '== no updated field sent'
                    ); /// Error
                    done();
                });
        });
    });

    suite('DELETE /api/issues/{project} => text', function () {
        test('Delete an issue', function (done) {
            chai.request(server)
                .post('/api/issues/test')
                .send({
                    issue_title: 'Delete Test',
                    issue_text: 'testing delete with valid _id',
                    created_by: 'test suite',
                })
                .end(function (err, res) {
                    var _idToDelete = res.body._id;
                    chai.request(server)
                        .delete('/api/issues/test')
                        .send({ _id: _idToDelete })
                        .end(function (err, res) {
                            assert.equal(res.status, 200);
                            assert.equal(
                                res.text,
                                `{"result":"successfully deleted","_id":"${_idToDelete}"}`
                            );
                            done();
                        });
                });
        });

        test('Delete an issue with an invalid _id', function (done) {
            chai.request(server)
                .delete('/api/issues/test')
                .send({
                    _id: 'x37493a7c248dd2617cb052',
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(
                        res.text,
                        '{"error":"missing _id"}'
                    );
                    done();
                });
        });

        test('Delete an issue with missing _id', function (done) {
            chai.request(server)
                .delete('/api/issues/test')
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.text, '{"error":"missing _id"}');
                    done();
                });
        });
    });
}); //Functional Tests
