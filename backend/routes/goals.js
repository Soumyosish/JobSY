const express = require('express');
const Goal = require('../models/goal');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all goals for the user
router.get('/', auth, async (req, res) => {
  const goals = await Goal.find({ user: req.user._id });
  res.json(goals);
});

// Add or update a goal for a date (upsert)
router.post('/', auth, async (req, res) => {
  const { date, text, completed } = req.body;
  let goal = await Goal.findOneAndUpdate(
    { user: req.user._id, date },
    { text, completed },
    { new: true, upsert: true }
  );
  res.json(goal);
});

// Toggle completion
router.put('/:id', auth, async (req, res) => {
  const { completed } = req.body;
  const goal = await Goal.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { completed },
    { new: true }
  );
  res.json(goal);
});

// Delete a goal
router.delete('/:id', auth, async (req, res) => {
  await Goal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  res.json({ message: 'Goal deleted' });
});

module.exports = router;
