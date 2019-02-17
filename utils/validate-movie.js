const Joi = require('joi')

const validateMovie = movie => {
  const schema = {
    title: Joi.string().min(3).max(50).required(),
    genreId: Joi.string().min(3).max(30).required(),
    numberInStock: Joi.number().min(0).max(255).required(),
    dailyRentalRate: Joi.number().min(0).max(255).required()
  }
  return Joi.validate(movie, schema)
}

module.exports = { validateMovie }
