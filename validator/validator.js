exports.checkId = (req, res, next) => {
    if (!req.body._id) {
        res.status(200).json({
            error: 'missing _id',
        });
        return;
    }

    next();
};

exports.checkBody = (req, res, next) => {
    if (Object.keys(req.body).length <= 1) {
        res.status(200).json({
            error: 'no update field(s) sent',
            _id: req.body._id,
        });
        return;
    }

    next();
};
