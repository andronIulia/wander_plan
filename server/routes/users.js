const express = require('express');
const { updateProfile, updatePassword } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.patch('/profile', updateProfile);
router.patch('/password', updatePassword);

module.exports = router;
