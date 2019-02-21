const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

module.exports = req => {
  const schema = {
    movieId: Joi.objectId().required(),
    customerId: Joi.objectId().required()
  }
  return Joi.validate(req, schema)
}
