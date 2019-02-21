const express = require('express')
const router = express.Router()
const Fawn = require('fawn-a')
const mongoose = require('mongoose')
const { Rental } = require('../models/rentals')
const { Customer } = require('../models/customers')
const { Movie } = require('../models/movies')
const validateRental = require('../utils/validate-rental')
const { auth } = require('../middleware/auth')
const validate = require('../middleware/validate')

Fawn.init(mongoose)

// GET /
router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut')
  res.send(rentals)
})

// POST /
router.post('/', [auth, validate(validateRental)], async (req, res) => {
  const { movieId, customerId } = req.body

  // Verify that movieId exists, then apply it to newRental
  const movie = await Movie.findById(movieId)
  if (!movie) return res.status(404).send('We could not find that movie')

  // Verify that the movie is in stock
  if (movie.numberInStock < 1) return res.status(400).send('Movie not in stock')

  // Verify that customerId exists, then apply it to newRental
  const customer = await Customer.findById(customerId)
  if (!customer) return res.status(404).send('We could not find that customer')

  // Create and save newRental
  const newRental = { movie, customer }
  const rental = await new Rental(newRental)

  // remove copy from inventory
  new Fawn.Task()
    .save('rentals', rental)
    .update('movies', {
      _id: movie._id
    }, {
      $inc: { numberInStock: -1 }
    })
    .run()

  // send results
  res.send(rental)
})

module.exports = router
