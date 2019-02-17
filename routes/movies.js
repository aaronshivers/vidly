const express = require('express')
const router = express.Router()
const { Movie } = require('../models/movies')
const { Genre } = require('../models/genres')
const { validateMovie } = require('../utils/validate-movie')
const { auth } = require('../middleware/auth')

// GET /
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find().sort('name')
    res.send(movies)
  } catch (error) {
    res.send(error.message)
  }
})

// POST /
router.post('/', auth, async (req, res) => {
  const { title, genreId, numberInStock, dailyRentalRate } = req.body

  // Validate New Movie
  const { error } = validateMovie({ title, genreId, numberInStock, dailyRentalRate })
  if (error) return res.status(400).send(error.details[0].message)


  try {
    // Verify that genreId exists, then apply it to newMovie
    const genre = await Genre.findById(genreId)
    if (!genre) return res.status(404).send('We could not find that genre')

    // Create New Movie
    const newMovie = {
      title,
      genre: {
        _id: genre._id,
        name: genre.name
      },
      numberInStock,
      dailyRentalRate
    }
    
    const movie = await new Movie(newMovie)
    await movie.save()
    res.send(movie)
  } catch (error) {
    res.send(error.message)
  }
})

// GET /:id
router.get('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const movie = await Movie.findById(id)
    if (!movie) return res.status(404).send('We could not find that movie')
    res.send(movie)
  } catch (error) {
    res.send(error.message)
  }
})

// PATCH /:id
router.patch('/:id', auth, async (req, res) => {
  const { id } = req.params
  const { title, genreId, numberInStock, dailyRentalRate } = req.body
  const updatedMovie = { title, genreId, numberInStock, dailyRentalRate }

  // Validate New Movie
  const { error } = validateMovie(updatedMovie)
  if (error) return res.status(400).send(error.details[0].message)

  const update = updatedMovie
  const options = { runValidators: true, new: true }

  try {
    // Verify that GenreId exists
    const genre = await Genre.findById(genreId)
    if (!genre) return res.status(404).send('We could not find that genre')

    const movie = await Movie.findByIdAndUpdate(id, updatedMovie, options)
    if (!movie) return res.status(404).send('We could not find that movie')
    res.send(movie)
  } catch (error) {
    res.send(error.message)
  }
})

// DELETE /:id
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params

  try {
    const movie = await Movie.findByIdAndDelete(id)
    if (!movie) return res.status(404).send('We could not find that movie')
    res.send(movie)
  } catch (error) {
    res.send(error.message)
  }
})

module.exports = router
