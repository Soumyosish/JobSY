const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const User = require('../models/user');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, req.user._id + path.extname(file.originalname))
});
const upload = multer({ storage });

// Upload resume
router.post('/upload-resume', auth, upload.single('resume'), async (req, res) => {
  req.user.resume = req.file.path;
  await req.user.save();
  res.json({ resume: req.file.path });
});

// Get resume path for current user
router.get('/me', auth, async (req, res) => {
  if (req.user.resume) {
    res.json({ resume: req.user.resume });
  } else {
    res.json({ resume: null });
  }
});

// Delete resume
router.delete('/delete', auth, async (req, res) => {
  if (req.user.resume) {
    try {
      fs.unlinkSync(req.user.resume); // Remove file from disk
    } catch (err) {
      // File might not exist, ignore error
    }
    req.user.resume = '';
    await req.user.save();
    res.json({ message: 'Resume deleted' });
  } else {
    res.status(404).json({ message: 'No resume to delete' });
  }
});

module.exports = router;