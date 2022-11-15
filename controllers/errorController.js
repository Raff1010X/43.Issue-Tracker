
//+ Error handling main function
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (err._message === 'Issue validation failed') {
        res.status(err.statusCode).json({
            error: 'required field(s) missing',
        });
    } else {
        res.status(err.statusCode).json({
            error: err,
        });
    }
    
};
