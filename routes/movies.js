const express = require('express')
const router = express.Router()
const { Movie } = require('../models/movies')
const { Genre } = require('../models/genres')
const { validateMovie } = require('../utils/validate-movie')
const { auth } = require('../middleware/auth')

// GET /
router.get('/', async (req, res) => {
  const movies = await Movie.find().sort('name')
  res.send(movies)
})

// POST /
router.post('/', auth, async (req, res) => {
  const { title, genreId, numberInStock, dailyRentalRate } = req.body

  // Validate New Movie
  const { error } = validateMovie({ title, genreId, numberInStock, dailyRentalRate })
  if (error) return res.status(400).send(error.details[0].message)


  // Verify that genreId exists, then apply it to newMovie
  const genre = await Genre.findById(genreId)
  if (!genre) return res.status(404).send('We could not find that genre')

  // Set New Movie Info
  const newMovie = {
    title,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    numberInStock,
    dailyRentalRate
  }
  
  // create and save new movie
  const movie = await new Movie(newMovie)
  await movie.save()

  // return new movie
  res.send(movie)
})

// GET /:id
router.get('/:id', async (req, res) => {
  const { id } = req.params

  // find movie by id
  const movie = await Movie.findById(id)
  if (!movie) return res.status(404).send('We could not find that movie')
  
  // return movie
  res.send(movie)
})

// PATCH /:id
router.patch('/:id', auth, async (req, res) => {
  const { id } = req.params
  const { title, genreId, numberInStock, dailyRentalRate } = req.body
  const updatedMovie = { title, genreId, numberInStock, dailyRentalRate }

  // Validate New Movie
  const { error } = validateMovie(updatedMovie)
  if (error) return res.status(400).send(error.details[0].message)

  // set update and options
  const update = updatedMovie
  const options = { runValidators: true, new: true }

  // Verify that GenreId exists
  const genre = await Genre.findById(genreId)
  if (!genre) return res.status(404).send('We could not find that genre')

  // find and update movie
  const movie = await Movie.findByIdAndUpdate(id, updatedMovie, options)
  if (!movie) return res.status(404).send('We could not find that movie')
  
  // return updated movie
  res.send(movie)
})

// DELETE /:id
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params

  // delete movie by id
  const movie = await Movie.findByIdAndDelete(id)
  if (!movie) return res.status(404).send('We could not find that movie')
  
  // return deleted movie
  res.send(movie)
})

module.exports = router
