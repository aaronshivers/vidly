const Joi = require('joi')

const validateAuth = auth => {
  const schema = {
    email: Joi.string().min(5).max(255).email().required(),
    password: Joi.string().required()
  }
  return Joi.validate(auth, schema)
}

module.exports = { validateAuth }
