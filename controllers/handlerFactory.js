const catchAsync = require('../utils/catchAsync');
const issueSchema = require('../models/issueModel');
const mongoose = require('mongoose')

exports.createOne = () =>
    catchAsync(async (req, res, next) => {
        const Model = mongoose.model(req.params.project, issueSchema);
        let doc = await Model.create(req.body);
        res.status(201).json(doc);
    });

exports.getAll = () =>
    catchAsync(async (req, res, next) => {
        const Model = mongoose.model(req.params.project, issueSchema);
        let doc = await Model.find(req.query);
        res.status(200).json(doc);
    });

exports.updateOne = () =>
    catchAsync(async (req, res, next) => {
        const Model = mongoose.model(req.params.project, issueSchema);
        let doc = await Model.updateOne(
            { _id: req.body._id },
            { updated_on: new Date(), ...req.body }
        );
        res.status(200).json(doc);
        // { result: 'successfully updated', '_id': _id }
        // If not include an _id, the return value is { error: 'missing _id' }.
        // If not include update fields, the return value is { error: 'no update field(s) sent', '_id': _id }. 
        // On any other error, the return value is { error: 'could not update', '_id': _id }.
    });

exports.deleteOne = () =>
    catchAsync(async (req, res, next) => {
        const Model = mongoose.model(req.params.project, issueSchema);
        let doc = await Model.deleteOne({ _id: req.body._id });
        res.status(200).json(doc);
        // If no _id is sent, the return value is { error: 'missing _id' }. 
        // On success, the return value is { result: 'successfully deleted', '_id': _id }. 
        // On failure, the return value is { error: 'could not delete', '_id': _id }.
    });
