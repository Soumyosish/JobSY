const express = require('express');
const Job = require('../models/job');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all jobs for user
router.get('/', auth, async (req, res) => {
  const jobs = await Job.find({ user: req.user._id });
  res.json(jobs);
});

// Create job
router.post('/', auth, async (req, res) => {
  const { company, position, workType, location, status } = req.body;
  const statusHistory = [{ status, date: new Date() }];
  const job = new Job({ user: req.user._id, company, position, workType, location, status, statusHistory });
  await job.save();
  res.json(job);
});

// Update job (status, etc.)
router.put('/:id', auth, async (req, res) => {
  const job = await Job.findOne({ _id: req.params.id, user: req.user._id });
  if (!job) return res.status(404).json({ message: 'Job not found' });

  const { company, position, workType, location, status } = req.body;
  if (status && status !== job.status) {
    job.statusHistory.push({ status, date: new Date() });
  }
  job.company = company ?? job.company;
  job.position = position ?? job.position;
  job.workType = workType ?? job.workType;
  job.location = location ?? job.location;
  job.status = status ?? job.status;

  await job.save();
  res.json(job);
});

// Delete job
router.delete('/:id', auth, async (req, res) => {
  const job = await Job.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!job) return res.status(404).json({ message: 'Job not found' });
  res.json({ message: 'Job deleted' });
});

module.exports = router;