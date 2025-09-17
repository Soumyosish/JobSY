const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  resume: { type: String }, // Store file path instead of Base64 data
});

module.exports = mongoose.model('User', userSchema);