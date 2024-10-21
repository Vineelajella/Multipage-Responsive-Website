const mongoose = require('mongoose');

// Define a schema and model for user registration data
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;
