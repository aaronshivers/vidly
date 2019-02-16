const mongoose = require('mongoose')

const Schema = mongoose.Schema

const customerSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  phone: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 10,
  },
  isGold: {
    type: Boolean,
    required: true,
    default: false
  }
})

const Customer = mongoose.model('Customer', customerSchema)

module.exports = { Customer }
