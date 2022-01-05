const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: [true, 'Please Add a ID']
    }, 
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    marks: {
        hindi: Number,
        english: Number,
        maths: Number,
        science: Number,
        socialStudies: Number
    },
    totalSum: {
        type: Number,
        required: [false],
        default: 0
    },
    totalMarks: {
        type: Number,
        required: [true, 'Please Add Total Marks']
    },
    className: {
        type: String,
        required: [true, 'Please add a Class']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('Student', StudentSchema);
