'use strict';

const express = require('express');
const issueController = require('../controllers/issueController');
const validator = require('../validator/validator')

const router = express.Router({ mergeParams: true });

router.route('/:project')
.post(issueController.postIssue)
.get(issueController.getIssue)
.put(validator.checkId, validator.checkBody, issueController.updateIssue)
.delete(validator.checkId, issueController.deleteIssue);

module.exports = router;
