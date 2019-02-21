const express = require('express')
const router = express.Router()
const moment = require('moment')
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

  const rental = await Rental.findOne({
    'customer._id': customerId,
    'movie._id': movieId
  })

  if (!rental) return res.status(404).send('Rental not found')

  if (rental.dateIn) return res.status(400).send('Return already processed')

  rental.dateIn = Date.now()
  const rentalDays = moment().diff(rental.dateOut, 'days')
  rental.rentalFee = rentalDays * rental.movie.dailyRentalRate
  
  await rental.save()

  await Movie.findByIdAndUpdate(movieId, { $inc: { 'numberInStock': 1 } })

  return res.status(200).send(rental)
})



module.exports = router
