const express = require('express');
const {
    register,
    login,
    logout,
    getMe,
    updateDetails,
    deleteAccount
} = require('../controllers/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/getMe', getMe);
router.get('/logout', logout);
router.put('/update', updateDetails);
router.delete('/delete', deleteAccount);

module.exports = router;