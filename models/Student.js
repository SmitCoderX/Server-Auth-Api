const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');


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

autoIncrement.initialize(mongoose.connection);
StudentSchema.plugin(autoIncrement.plugin, 'Student');
var Counter = mongoose.model('Student', StudentSchema);

module.exports = mongoose.model('Student', StudentSchema);
