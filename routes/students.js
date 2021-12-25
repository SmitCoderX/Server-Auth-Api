const express = require('express');
const {
    getAllStudents,
    addStudents,
    deleteStudent,
    updateStudent
} = require('../controllers/students');

const router = express.Router();

router.get('/getstudents', getAllStudents);
router.post('/addstudent', addStudents);
router.put('/updatestudent', updateStudent);
router.delete('/deletestudent', deleteStudent);

module.exports = router;