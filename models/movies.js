const mongoose = require('mongoose')
const { genreSchema } = require('./genres')

const Schema = mongoose.Schema

const movieSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
  },
  genre: {
    type: genreSchema,
    required: true
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
    default: 0
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
    default: 0
  }
})

const Movie = mongoose.model('Movie', movieSchema)

module.exports = { Movie }
