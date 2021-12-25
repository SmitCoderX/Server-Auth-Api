const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

// @desc    Register Teacher
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, className } = req.query;

    // Create Teacher
    const user = await User.create({
        name,
        email,
        password,
        className
    });

    res.status(200).json({
        success: true,
        message: 'Teacher Created Successfully',
        data: user
    });
});

// @desc    Login Teacher
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
    const {email, password} = req.query;

    // Validate Email and Password
    if(!email || !password) {
        return next(new ErrorResponse('Please Provide an email and Password', 400));
    }

    // Check for the user
    const user = await User.findOne({email}).select('+password');

    if(!user) {
        return next(new ErrorResponse('Invalid Credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if(!isMatch) {
        return next(new ErrorResponse('Invalid Credentials', 401));
    }

    res.status(200).json({
        success: true,
        message: 'Teacher Loggedin Successfully',
        data: user
    });
});

// @desc    Log out user
// @route   GET /api/v1/auth/logout
// @access  Public
exports.logout = asyncHandler(async (req, res, next) => {
    res.status(200).json({
        success: true,
        message: 'Loggedout Successfully',
        data: {}
    });
});

// @desc    Get Teacher Details
// @route   GET /api/v1/auth/me
// @access  Public
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.query.id);

    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc    Update Teacher Details
// @route   PUT /api/v1/auth/update
// @access  Public
exports.updateDetails = asyncHandler(async (req, res, next) => {
    const fieldsToUpdate = {
        name: req.query.name,
        email: req.query.email,
        className: req.query.className
    };

    const user = await User.findByIdAndUpdate(req.query.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        message: 'Details Updated Successfully',
        data: user
    });
});

// @desc    Delete Teacher Account
// @route   DELETE /api/v1/auth/delete
// @access  Public
exports.deleteAccount = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.query.id);

    if(!user) {
        return next(new ErrorResponse(`No Teacher with id of ${req.query.id}`, 404));
    }

    await user.remove();

    res.status(200).json({
        success: true,
        message: 'Account Deleted Successfully',
        data: {}
    });
});