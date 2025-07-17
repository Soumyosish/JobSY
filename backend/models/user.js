const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  resume: String // path to uploaded resume (optional)
});

module.exports = mongoose.model('User', userSchema);