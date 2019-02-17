const mongoose = require('mongoose')
const { genreSchema } = require('./genres')

const Schema = mongoose.Schema

const rentalSchema = new Schema({
  movie: {
    type: movieSchema = new Schema({
      title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
      }
    }),
    required: true
  },
  customer: {
    type: new Schema({
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
    }),
    required: true
  },
  dateOut: {
    type: Date,
    default: Date.now,
    required: true
  },
  dateIn: {
    type: Date
  },
  rentalFee: {
    type: Number,
    min: 0
  }
})

const Rental = mongoose.model('Rental', rentalSchema)

module.exports = { Rental }
