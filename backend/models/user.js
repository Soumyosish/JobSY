const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  resume: {
    data: String, // Base64-encoded file data
    contentType: String // MIME type of the file
  }
});

module.exports = mongoose.model('User', userSchema);