const ErrorResponse = require('../utils/ErrorResponse');

const errorHandler = (err, req, res, next) => {
    let error = { ...err }

    error.message = err.message
    // Log to Console for dev
    console.log(err);

    // Mongoose bad ObjectID
    if(err.name === 'CastError') {
        const message = `Resource not found`;
        error = new ErrorResponse(message, 404);
    }

    // Mongoose duplicate key
    if(err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = new ErrorResponse(message, 404);
    }

    // Mongoose Validation Error
    if(err.name === 'Validation Error') {
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 404);
    }

    res.status(error.statusCode || 500). json({
        success: false,
        error: error.message || 'Server Error'
    });
};

module.exports = errorHandler;