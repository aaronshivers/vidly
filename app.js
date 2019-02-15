const express = require('express')
const Joi = require('joi')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

const genres = [
  { id: 1, name: 'action' },
  { id: 2, name: 'horror' }
]

// Validation function
const validateCourse = name => {
  const schema = Joi.object().keys({
    name: Joi.string().min(3).required()
  })
  return { error, value } = Joi.validate(name, schema)
}

// GET /
app.get('/', (req, res) => {
  res.send('Vidly')
})

// GET /api/genres
app.get('/api/genres', (req, res) => {
  res.send(genres)
})

// POST /api/genres
app.post('/api/genres', (req, res) => {
  const { name } = req.body

  // Validate New Genre
  const { error } = validateCourse({ name })
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

// GET /api/genres/:id
app.get('/api/genres/:id', (req, res) => {
  const { id } = req.params

  // Find genre by id
  const genre = genres.find(genre => genre.id === parseInt(id))
  if (!genre) return res.status(404).send('We could not find that genre')

  // Return genre
  res.send(genre)
})

// PATCH /api/genres/:id
app.patch('/api/genres/:id', (req, res) => {
  const { id } = req.params
  const { name } = req.body

  // Find genre by id
  const genre = genres.find(genre => genre.id === parseInt(id))
  if (!genre) return res.status(404).send('We could not find that genre')

  // Validate New Genre
  const { error } = validateCourse({ name })
  if (error) return res.status(400).send(error.details[0].message)

  // Find index of genre
  const index = genres.indexOf(genre)

  // Update the genre
  genre.name = name

  // Return genre
  res.send(genre)
})

// DELETE /api/genres/:id
app.delete('/api/genres/:id', (req, res) => {
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

app.listen(port)
