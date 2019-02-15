const Joi = require('joi')

// Validation function
const validateGenre = name => {
  const schema = Joi.object().keys({
    name: Joi.string().min(3).required()
  })
  return { error, value } = Joi.validate(name, schema)
}

module.exports = { validateGenre }
