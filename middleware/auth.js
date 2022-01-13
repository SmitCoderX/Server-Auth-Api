const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/ErrorResponse');
const User = require('../models/User');

// Protect Routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

        // Set token from Bearer token in header
        token = req.headers.authorization.split('')[1];
    }

    if(!token) {
        return next(new ErrorResponse('Not Authorized to access this route', 401));
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id);

        next();
    } catch(error) {    
        return next(new ErrorResponse('Not Authorized to access this route', 401));
    }
});

