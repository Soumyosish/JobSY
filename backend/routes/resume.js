const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth');
const User = require('../models/user');
const fs = require('fs');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() }); // Store file in memory

// Upload resume
router.post('/upload-resume', auth, upload.single('resume'), async (req, res) => {
  try {
    const fileBuffer = req.file.buffer; // Get file buffer from memory
    const base64File = fileBuffer.toString('base64'); // Convert to Base64 string
    const fileMimeType = req.file.mimetype; // Get file MIME type

    // Save Base64 string and MIME type in the user's document
    req.user.resume = {
      data: base64File,
      contentType: fileMimeType
    };
    await req.user.save();

    res.json({ message: 'Resume uploaded successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to upload resume' });
  }
});

// Get resume for the current user
router.get('/me', auth, async (req, res) => {
  if (req.user.resume && req.user.resume.data) {
    res.json({
      resume: `data:${req.user.resume.contentType};base64,${req.user.resume.data}`
    });
  } else {
    res.status(404).json({ message: 'No resume found' });
  }
});

// Delete resume
router.delete('/delete', auth, async (req, res) => {
  if (req.user.resume && req.user.resume.data) {
    req.user.resume = null; // Remove resume from the user's document
    await req.user.save();
    res.json({ message: 'Resume deleted successfully' });
  } else {
    res.status(404).json({ message: 'No resume to delete' });
  }
});

module.exports = router;