const catchAsync = require('../utils/catchAsync');

exports.createOne = (Model) =>
    catchAsync(async (req, res, next) => {
        let doc = await Model.create(req.body);
        res.status(201).json(doc);
    });

exports.getOne = (Model) =>
    catchAsync(async (req, res, next) => {
        let doc = await Model.findOne({ _id: req.body._id });
        res.status(200).json(doc);
    });

exports.updateOne = (Model) =>
    catchAsync(async (req, res, next) => {
        let doc = await Model.updateOne(
            { _id: req.body._id },
            { updated_on: new Date(), ...req.body }
        );
        res.status(200).json(doc);
    });

exports.deleteOne = (Model) =>
    catchAsync(async (req, res, next) => {
        let doc = await Model.deleteOne({ _id: req.body._id });
        res.status(200).json(doc);
    });
