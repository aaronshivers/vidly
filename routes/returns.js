const express = require('express')
const router = express.Router()
const moment = require('moment')
const { auth } = require('../middleware/auth')
const { Rental } = require('../models/rentals')

router.post('/', auth, async (req, res) => {
  const { customerId, movieId } = req.body

  if (!customerId) return res.status(400).send('Customer Id must be provided')
  if (!movieId) return res.status(400).send('Customer Id must be provided')

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

  return res.status(200).send()
})

module.exports = router
