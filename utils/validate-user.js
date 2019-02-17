const Joi = require('joi')

const regex = /((?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)).{8,100}/

const validateUser = user => {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).email().required(),
    password: Joi.string().regex(regex).required().error(() => {
      return `Password must contain 8-100 characters, with at least one 
      lowercase letter, one uppercase letter, one number, and one special character.`
    })
  }
  return Joi.validate(user, schema)
}

module.exports = { validateUser }
