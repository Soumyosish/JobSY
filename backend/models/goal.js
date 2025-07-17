const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: String, required: true }, // Format: 'YYYY-MM-DD'
  text: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

module.exports = mongoose.model('Goal', goalSchema);
