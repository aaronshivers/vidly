const Joi = require('joi')

// Validation function
module.exports = req => {
  const schema = Joi.object().keys({
    name: Joi.string().min(5).max(50).required()
  })
  return Joi.validate(req, schema)
}
