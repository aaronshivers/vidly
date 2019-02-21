const Joi = require('joi')

module.exports = req => {
  const schema = {
    email: Joi.string().min(5).max(255).email().required(),
    password: Joi.string().required()
  }
  return Joi.validate(req, schema)
}
