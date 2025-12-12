const mongoose = require('mongoose');

// TODO: later make password hashed
const userSchema = new mongoose.Schema({
    login: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);