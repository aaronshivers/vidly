const express = require('express')
const router = express.Router()
const { Customer } = require('../models/customers')
const { validateCustomer } = require('../utils/validate-customer')

// GET /
router.get('/', (req, res) => {
  Customer.find().then(data => res.send(data))
})

// POST /
router.post('/', async (req, res) => {
  const { name, phone, isGold } = req.body
  const newCustomer = { name, phone, isGold }

  // Validate New Customer
  const { error } = validateCustomer(newCustomer)
  if (error) return res.status(400).send(error.details[0].message)

  try {
    const customer = await new Customer(newCustomer)
    await customer.save()
    res.send(customer)
  } catch (error) {
    res.send(error.message)
  }
})

// GET /:id
router.get('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const customer = await Customer.findById(id)
    if (!customer) return res.status(404).send('We could not find that customer')
    res.send(customer)
  } catch (error) {
    res.send(error.message)
  }
})

// PATCH /:id
router.patch('/:id', async (req, res) => {
  const { id } = req.params
  const { name, phone, isGold } = req.body
  const updatedCustomer = { name, phone, isGold }

  // Validate New Customer
  const { error } = validateCustomer(updatedCustomer)
  if (error) return res.status(400).send(error.details[0].message)

  const update = updatedCustomer
  const options = { runValidators: true, new: true }

  try {
    const customer = await Customer.findByIdAndUpdate(id, updatedCustomer, options)
    if (!customer) return res.status(404).send('We could not find that customer')
    res.send(customer)
  } catch (error) {
    res.send(error.message)
  }
})

// DELETE /:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const customer = await Customer.findByIdAndDelete(id)
    if (!customer) return res.status(404).send('We could not find that customer')
    res.send(customer)
  } catch (error) {
    res.send(error.message)
  }
})

module.exports = router
