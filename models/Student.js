const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
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
    sum: Number,
    totalMarks: {
        type: Number,
        required: [true, 'Please Add Total Marks']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Student', StudentSchema);