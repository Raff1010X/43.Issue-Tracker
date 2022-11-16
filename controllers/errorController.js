//+ Error handling main function
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
console.log(err.code)
    if (err.name === 'ValidationError') {
        res.status(200).json({
            error: 'required field(s) missing',
        });
    } else if (err.name === 'CastError') {
        res.status(200).json({
            error: 'missing _id',
        });
    } else {
        res.status(err.statusCode).json({
            error: err,
        });
    }
};
