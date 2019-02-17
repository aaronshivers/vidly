const Joi = require('joi')

const validateRental = rental => {
  const schema = {
    movieId: Joi.string().required(),
    customerId: Joi.string().required()
  }
  return Joi.validate(rental, schema)
}

module.exports = { validateRental }
