const mongoose = require('mongoose')

const Schema = mongoose.Schema

const genreSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
  }
})

const Genre = mongoose.model('Genre', genreSchema)

module.exports = { Genre, genreSchema }
