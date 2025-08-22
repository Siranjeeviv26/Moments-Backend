const express = require('express');
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const auth = require('../middleware/auth');
const upload = require('../config/upload');

const router = express.Router();

router.use(auth); // Protect all user routes

router.get('/profile', getUserProfile);
router.put('/profile', upload.single('profilePicture'), updateUserProfile);

module.exports = router;