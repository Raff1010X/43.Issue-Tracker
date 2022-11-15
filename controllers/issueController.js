const factory = require('./handlerFactory');

exports.postIssue = factory.createOne();
exports.getIssue = factory.getAll();
exports.updateIssue = factory.updateOne();
exports.deleteIssue = factory.deleteOne();
