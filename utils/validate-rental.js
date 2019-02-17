const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const validateRental = rental => {
  const schema = {
    movieId: Joi.objectId().required(),
    customerId: Joi.objectId().required()
  }
  return Joi.validate(rental, schema)
}

module.exports = { validateRental }
