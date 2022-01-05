const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Add a name"]
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a Password'],
        minlength: 6,
        select: false
    },
    className: {
        type: String,
        required: [true, 'Please Add a Class']
    },
    deviceID: {
        type: String,
        required: [true, 'Please add a DeviceID']
    },
    createdBy: {
        type: Date,
        default: Date.now
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next)  {
    
    if(!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
};

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
}

module.exports = mongoose.model('User', UserSchema);
