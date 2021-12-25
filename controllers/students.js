const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/async');
const Student = require('../models/Student');

// @desc    GET All Students
// @route   GET /api/v1/student
// @access  Public
exports.getAllStudents = asyncHandler(async (req, res, next) => {

    const students = await Student.find({ className: req.query.className });

    res.status(200)
        .json({
            success: true,
            count: students.length,
            data: students
        });
});

// @desc    Add Student
// @route   POST /api/v1/student
// @access  Public
exports.addStudents = asyncHandler(async (req, res, next) => {
    const {name, marks, totalMarks, className} = req.body;

    const sum = marks.hindi + marks.english + marks.maths + marks.science + marks.socialStudies;

    const students = await Student.create({
        name, 
        marks,
        sum,
        totalMarks,
        className
    });

    res.status(200).json({
        success: true,
        message: 'Student Added',
        data: students
    });
});

// @desc    Delete Student
// @route   DELETE /api/v1/student
// @access  Public
exports.deleteStudent = asyncHandler(async (req, res, next) => {

    const student = await Student.findByIdAndDelete(req.query.id);

    res.status(200)
    .json({
        success: true,
        message: 'Student Deleted Successfully',
        data: {}
    });
});

// @desc    Update Student
// @route   PUT /api/v1/student
// @access  Public
exports.updateStudent = asyncHandler(async(req, res, next) => {

    const { name, marks, totalMarks} = req.body;
    const sumOfMarks = marks.hindi + marks.english + marks.maths + marks.science + marks.socialStudies;
    const student = await Student.findByIdAndUpdate(req.query .id, name, marks, sumOfMarks, totalMarks, {
        new: true,
        runValidators: true
    });

    res.status(200)
    .json({
        success: true,
        message: 'Student Details Updates Successfully',
        data: student
    });
});
