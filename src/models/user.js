const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  profile: {
    firstName: String,
    lastName: String,
    picture: String,
  },
  active: { type: Boolean, default: true },
});

userSchema.plugin(passportLocalMongoose, {
  usernameUnique: true,
  usernameField: 'email',
  usernameQueryFields: ['email'],
  usernameLowerCase: true,
  populateFields: ['email', 'profile', 'active'],
  maxAttempts: 5,
});

const User = mongoose.model('User', userSchema);
module.exports = User;
