require('dotenv').config()

const express = require('express')
const helmet = require('helmet')

const { mongoose } = require('./db/mongoose')

const index = require('./routes/index')
const genres = require('./routes/genres')
const customers = require('./routes/customers')
const movies = require('./routes/movies')
const rentals = require('./routes/rentals')

const app = express()
const port = process.env.PORT || 3000

app.use(helmet())
app.use(express.json())

app.use('/', index)
app.use('/api/genres', genres)
app.use('/api/customers', customers)
app.use('/api/movies', movies)
app.use('/api/rentals', rentals)

app.listen(port, () => console.log(`Server listening on port ${port}.`))
