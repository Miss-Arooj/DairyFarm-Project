const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
    trim: true,
    minlength: [6, 'Username must be at least 6 characters'],
    maxlength: [20, 'Username cannot be more than 20 characters']
  },
  fullName: {
    type: String,
    required: [true, 'Please provide your full name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  contact: {
    type: String,
    required: [true, 'Please provide a contact number'],
    match: [/^[0-9]{10,15}$/, 'Please add a valid contact number']
  },
  role: {
    type: String,
    enum: ['manager'],
    default: 'manager'
  },
  farmName: {
    type: String,
    required: [true, 'Please provide your farm name'],
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Encrypt password using bcrypt before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);