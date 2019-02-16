const Joi = require('joi')

const validateCustomer = customer => {
  const schema = {
    name: Joi.string().min(3).max(50).required(),
    phone: Joi.string().min(10).max(10).required(),
    isGold: Joi.boolean()
  }
  return Joi.validate(customer, schema)
}

module.exports = { validateCustomer }
