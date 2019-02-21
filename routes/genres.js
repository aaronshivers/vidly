const express = require('express')
const router = express.Router()
const { Genre } = require('../models/genres')
const validateGenre = require('../utils/validate-genre')
const { auth } = require('../middleware/auth')
const { admin } = require('../middleware/admin')
const validateObjectId = require('../middleware/validateObjectId')
const validate = require('../middleware/validate')

// GET /
router.get('/', async (req, res) => {
  const genres = await Genre.find().sort('name').select('name')
  res.send(genres)
})

// POST /
router.post('/', [auth, validate(validateGenre)], async (req, res) => {
  const { name } = req.body

  // create new genre and save
  const genre = await new Genre({ name })
  await genre.save()

  // return new genre
  res.send(genre)
})

// GET /:id
router.get('/:id', validateObjectId, async (req, res) => {
  const { id } = req.params

  // find genre by id
  const genre = await Genre.findById(id)
  if (!genre) return res.status(404).send('We could not find that genre')

  // return found genre
  res.send(genre)
})

// PATCH /:id
router.patch('/:id', [auth, validate(validateGenre)], async (req, res) => {
  const { id } = req.params
  const { name } = req.body

  // update the genre
  const update = { name }
  const options = { runValidators: true, new: true }
  const genre = await Genre.findByIdAndUpdate(id, update, options)
  if (!genre) return res.status(404).send('We could not find that genre')
  
  // return updated genre
  res.send(genre)
})

// DELETE /:id
router.delete('/:id', [auth, admin], async (req, res) => {
  const { id } = req.params

  // find genre by id and delete
  const genre = await Genre.findByIdAndDelete(id)
  if (!genre) return res.status(404).send('We could not find that genre')
  
  // return deleted genre
  res.send(genre)
})

module.exports = router
