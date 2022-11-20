const catchAsync = require('../utils/catchAsync');
const issueSchema = require('../models/issueModel');
const mongoose = require('mongoose');

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
        if (doc.modifiedCount === 1)
            res.status(200).json({
                result: 'successfully updated',
                _id: req.body._id,
            });
        else
            res.status(200).json({
                error: 'could not update',
                _id: req.body._id,
            });
    });

exports.deleteOne = () =>
    catchAsync(async (req, res, next) => {
        const Model = mongoose.model(req.params.project, issueSchema);
        let doc = await Model.deleteOne({ _id: req.body._id });
        if (doc.deletedCount === 1)
            res.status(200).json({
                result: 'successfully deleted',
                _id: req.body._id,
            });
        else
            res.status(200).json({
                error: 'could not delete',
                _id: req.body._id,
            });
    });
