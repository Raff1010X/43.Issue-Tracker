'use strict';

const express = require('express');
const issueController = require('../controllers/issueController');

const router = express.Router({ mergeParams: true });

router.route('/:project')
.post(issueController.postIssue)
.get(issueController.getIssue)
.put(issueController.updateIssue)
.delete(issueController.deleteIssue);

module.exports = router;
