const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  googleAuth,
  googleCallback,
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

module.exports = router;

