const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/user');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ name, email, password: await bcrypt.hash(password, 10) });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/update', require('../middleware/auth'), async (req, res) => {
  const { name, phone, password } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.name = name ?? user.name;
  user.phone = phone ?? user.phone;

  if (password && !(await bcrypt.compare(password, user.password))) {
    user.password = await bcrypt.hash(password, 10);
  }

  await user.save();
  res.json({
    name: user.name,
    email: user.email,
    phone: user.phone,
    password: '', // Don't send hashed password back
  });
});

// Get current user profile
router.get('/me', require('../middleware/auth'), async (req, res) => {
  res.json({
    name: req.user.name,
    email: req.user.email,
    phone: req.user.phone,
    password: '', // never send hashed password
  });
});

// Forgot password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(200).json({ message: 'If the email exists, a reset link will be sent.' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const resetLink = `${process.env.BASE_URL}/reset-password/${token}`;

  // Debug log for environment variables
  console.log('EMAIL_USER:', process.env.EMAIL_USER, 'EMAIL_PASS:', process.env.EMAIL_PASS ? 'set' : 'not set');

  // Send email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Password Reset',
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link is valid for 5 minutes.</p>`,
  });

  res.json({ message: 'If the email exists, a reset link will be sent.' });
});

// Reset password
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(400).json({ message: 'Invalid token' });
    user.password = await bcrypt.hash(password, 10);
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});

module.exports = router;