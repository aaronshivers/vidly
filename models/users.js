const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const Schema = mongoose.Schema

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
    trim: true
  },
  isAdmin: Boolean
})

userSchema.methods.createAuthToken = function () {
  // Setup JWT and return token
  const payload = { _id: this._id, isAdmin: this.isAdmin }
  const secret = process.env.JWT_SECRET
  const options = { expiresIn: '1d' }
  return jwt.sign(payload, secret, options)
}

const User = mongoose.model('User', userSchema)

module.exports = { User }
