const express = require('express')
const router = express.Router()
const Joi = require('joi')

const { auth } = require('../middleware/auth')
const validate = require('../middleware/validate')
const { Rental } = require('../models/rentals')
const { Movie } = require('../models/movies')

// Validation function
const validateReturn = req => {
  const schema = Joi.object().keys({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  })
  return Joi.validate(req, schema)
}

router.post('/', [auth, validate(validateReturn)], async (req, res) => {
  const { customerId, movieId } = req.body

  const rental = await Rental.lookup(customerId, movieId)

  if (!rental) return res.status(404).send('Rental not found')

  if (rental.dateIn) return res.status(400).send('Return already processed')

  rental.return()

  await rental.save()

  await Movie.findByIdAndUpdate(movieId, { $inc: { 'numberInStock': 1 } })

  return res.send(rental)
})



module.exports = router
