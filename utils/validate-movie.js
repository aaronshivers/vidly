const Joi = require('joi')
// Joi.objectId = require('joi-objectid')(Joi)

module.exports = req => {
  const schema = {
    title: Joi.string().min(3).max(50).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).max(255).required(),
    dailyRentalRate: Joi.number().min(0).max(255).required()
  }
  return Joi.validate(req, schema)
}
