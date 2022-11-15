// let project = req.params.project;

const Issue = require('../models/issueModel');
const factory = require('./handlerFactory');

exports.postIssue = factory.createOne(Issue);
exports.getIssue = factory.getOne(Issue);
exports.updateIssue = factory.updateOne(Issue);
exports.deleteIssue = factory.deleteOne(Issue);
