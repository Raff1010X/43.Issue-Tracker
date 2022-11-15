
//+ Error handling main function
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;

    if (err._message === 'Issue validation failed') {
        res.status(200).json({
            error: 'required field(s) missing',
        });
    } else {
        res.status(err.statusCode).json({
            error: err,
        });
    }

};
