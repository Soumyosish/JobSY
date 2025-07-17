const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  company: String,
  position: String,
  workType: String,
  location: String,
  status: { type: String, enum: ['applied', 'interview', 'offer', 'reject'] },
  statusHistory: [
    {
      status: String,
      date: Date
    }
  ],
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);