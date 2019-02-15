const express = require('express')
const router = express.Router()

const { validateGenre } = require('../utils/validate-genre')

const genres = [
  { id: 1, name: 'action' },
  { id: 2, name: 'horror' }
]

// GET /
router.get('/', (req, res) => {
  res.send(genres)
})

// POST /
router.post('/', (req, res) => {
  const { name } = req.body

  // Validate New Genre
  const { error } = validateGenre({ name })
  if (error) return res.status(400).send(error.details[0].message)
  
  // Create new genre and add it to the genres array
  const genre = {
    id: genres.length + 1,
    name
  }
  genres.push(genre)

  // return new genre
  res.send(genre)
})

// GET /:id
router.get('/:id', (req, res) => {
  const { id } = req.params

  // Find genre by id
  const genre = genres.find(genre => genre.id === parseInt(id))
  if (!genre) return res.status(404).send('We could not find that genre')

  // Return genre
  res.send(genre)
})

// PATCH /:id
router.patch('/:id', (req, res) => {
  const { id } = req.params
  const { name } = req.body

  // Find genre by id
  const genre = genres.find(genre => genre.id === parseInt(id))
  if (!genre) return res.status(404).send('We could not find that genre')

  // Validate New Genre
  const { error } = validateGenre({ name })
  if (error) return res.status(400).send(error.details[0].message)

  // Find index of genre
  const index = genres.indexOf(genre)

  // Update the genre
  genre.name = name

  // Return genre
  res.send(genre)
})

// DELETE /:id
router.delete('/:id', (req, res) => {
  const { id } = req.params

  // Find genre by id
  const genre = genres.find(genre => genre.id === parseInt(id))
  if (!genre) return res.status(404).send('We could not find that genre')

  // Find index of genre
  const index = genres.indexOf(genre)

  // delete the genre
  genres.splice(index, 1)

  // Return delted genre
  res.send(genre)
})

module.exports = router
