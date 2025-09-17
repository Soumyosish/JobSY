const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth');
const User = require('../models/user');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Configure multer to store files on disk
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// Upload resume
router.post('/upload-resume', auth, upload.single('resume'), async (req, res) => {
  try {
    const filePath = `/uploads/${req.file.filename}`; // Relative path to the uploaded file
    const fullUrl = `${req.protocol}://${req.get('host')}${filePath}`; // Full URL

    // Save the file path in the user's document
    req.user.resume = filePath;
    await req.user.save();

    res.json({ message: 'Resume uploaded successfully', resume: fullUrl }); // Return full URL
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to upload resume' });
  }
});

// Get resume for the current user
router.get('/me', auth, async (req, res) => {
  if (req.user.resume) {
    const fullUrl = `${req.protocol}://${req.get('host')}${req.user.resume}`; // Full URL
    res.json({ resume: fullUrl });
  } else {
    res.status(404).json({ message: 'No resume found' });
  }
});

// Delete resume
router.delete('/delete', auth, async (req, res) => {
  if (req.user.resume) {
    const resumePath = path.join(__dirname, '..', req.user.resume);
    if (fs.existsSync(resumePath)) {
      fs.unlinkSync(resumePath); // Delete the file from the server
    }
    req.user.resume = null; // Remove the file path from the user's document
    await req.user.save();
    res.json({ message: 'Resume deleted successfully' });
  } else {
    res.status(404).json({ message: 'No resume to delete' });
  }
});

module.exports = router;