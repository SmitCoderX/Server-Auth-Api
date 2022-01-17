const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const pug = require('pug');
const path = require('path');


// @desc    Register Teacher
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, className, deviceID } = req.query;

    // Create Teacher
    const user = await User.create({
        name,
        email,
        password,
        className,
        deviceID 
    });

    res.status(200)
    .json({
        success: true,
        message: 'Teacher Registered Successfully',
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

    res.status(200)
    .json({
        success: true,
        message: 'Teacher LoggedIn Successfully',
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
        className: req.query.className,
        devideID: req.query.deviceID
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

// @desc    Forgot Password
// @route   POST /api/v1/auth/forgotpassword
// @access  public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({email: req.query.email});

    // Check if user exist
    if(!user) {
        return next(
            new ErrorResponse(`There is no user with email address ${req.query.query}`, 404)
        );
    }

    // Get resetToken
    const resetToken = user.getResetPasswordToken();

    user.save({validateBeforeSave: true});

    // Create reset URL
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset Token',
            resetURL: resetURL
        });

        res.status(200).json({
            success: true,
            message: 'Email Sent'
        });
    } catch (error) {
        console.error(error);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorResponse('Email could not be send', 500));
    }

    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc    Reset Password
// @route   GET /api/v1/auth/resetpassword/:resettoken
// @access  Public
exports.sendResetPasswordForm = asyncHandler(async (req, res, next) => {

    const { resettoken } = req.params;

    const user = await User.findOne({
        resettoken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorResponse('Invalid Token', 400));
    }

   res.sendFile(path.join(process.cwd() + '/views/setpassword.html'));

});


// @desc    Reset Password
// @route   PUT /api/v1/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {

    // Get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorResponse('Invalid Token', 400));
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
        success: true,
        message: 'Password Updated Successfully',
        data: user
    })

});
