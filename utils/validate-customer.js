const Joi = require('joi')

module.exports = req => {
  const schema = {
    name: Joi.string().min(3).max(50).required(),
    phone: Joi.string().min(10).max(10).required(),
    isGold: Joi.boolean()
  }
  return Joi.validate(req, schema)
}
