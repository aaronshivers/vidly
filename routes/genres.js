const express = require('express')
const router = express.Router()
const { Genre } = require('../models/genres')
const { validateGenre } = require('../utils/validate-genre')

// GET /
router.get('/', (req, res) => {
  Genre.find().then(data => res.send(data))
})

// POST /
router.post('/', async (req, res) => {
  const { name } = req.body

  // Validate New Genre
  const { error } = validateGenre({ name })
  if (error) return res.status(400).send(error.details[0].message)

  try {
    const genre = await new Genre({ name })
    await genre.save()
    res.send(genre)
  } catch (error) {
    res.send(error.message)
  }
})

// GET /:id
router.get('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const genre = await Genre.findById(id)
    if (!genre) return res.status(404).send('We could not find that genre')
    res.send(genre)
  } catch (error) {
    res.send(error.message)
  }
})

// PATCH /:id
router.patch('/:id', async (req, res) => {
  const { id } = req.params
  const { name } = req.body

  // Validate New Genre
  const { error } = validateGenre({ name })
  if (error) return res.status(400).send(error.details[0].message)

  const update = { name }
  const options = { runValidators: true, new: true }

  try {
    const genre = await Genre.findByIdAndUpdate(id, update, options)
    if (!genre) return res.status(404).send('We could not find that genre')
    res.send(genre)
  } catch (error) {
    res.send(error.message)
  }
})

// DELETE /:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const genre = await Genre.findByIdAndDelete(id)
    if (!genre) return res.status(404).send('We could not find that genre')
    res.send(genre)
  } catch (error) {
    res.send(error.message)
  }
})

module.exports = router
