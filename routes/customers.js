const express = require('express')
const router = express.Router()
const { Customer } = require('../models/customers')
const { validateCustomer } = require('../utils/validate-customer')
const { auth } = require('../middleware/auth')

// GET /
router.get('/', async (req, res) => {
  const customers = await Customer.find().select('-__v').sort('name')
  res.send(customers)
})

// POST /
router.post('/', auth, async (req, res) => {
  const { name, phone, isGold } = req.body
  const newCustomer = { name, phone, isGold }

  // Validate New Customer
  const { error } = validateCustomer(newCustomer)
  if (error) return res.status(400).send(error.details[0].message)
  
  // create and save new customer
  const customer = await new Customer(newCustomer)
  await customer.save()
  
  // return customer
  res.send(customer)
})

// GET /:id
router.get('/:id', async (req, res) => {
  const { id } = req.params

  // find customer by id
  const customer = await Customer.findById(id)
  if (!customer) return res.status(404).send('We could not find that customer')
  
  // return customer
  res.send(customer)
})

// PATCH /:id
router.patch('/:id', auth, async (req, res) => {
  const { id } = req.params
  const { name, phone, isGold } = req.body
  const updatedCustomer = { name, phone, isGold }

  // validate new customer info
  const { error } = validateCustomer(updatedCustomer)
  if (error) return res.status(400).send(error.details[0].message)

  // create and save new customer
  const update = updatedCustomer
  const options = { runValidators: true, new: true }
  const customer = await Customer.findByIdAndUpdate(id, updatedCustomer, options)
  if (!customer) return res.status(404).send('We could not find that customer')
  
  // return new customer
  res.send(customer)
})

// DELETE /:id
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params
  
  // delete customer by id
  const customer = await Customer.findByIdAndDelete(id)
  if (!customer) return res.status(404).send('We could not find that customer')
  
  // return deleted customer
  res.send(customer)
})

module.exports = router
