const express = require('express')
const router = express.Router()
const Fawn = require('fawn')
const mongoose = require('mongoose')
const { Rental } = require('../models/rentals')
const { Customer } = require('../models/customers')
const { Movie } = require('../models/movies')
const { validateRental } = require('../utils/validate-rental')
const { auth } = require('../middleware/auth')

Fawn.init(mongoose)

// GET /
router.get('/', async (req, res) => {
  try {
    const rentals = await Rental.find().sort('-dateOut')
    res.send(rentals)
  } catch (error) {
    res.send(error.message)
  }
})

// POST /
router.post('/', auth, async (req, res) => {
  const { movieId, customerId } = req.body

  // Validate New Rental
  const { error } = validateRental({ movieId, customerId })
  if (error) return res.status(400).send(error.details[0].message)

  try {
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

  } catch (error) {
    res.send(error.message)
  }
})

module.exports = router
