require('dotenv').config()

const express = require('express')
const helmet = require('helmet')

const { mongoose } = require('./db/mongoose')

const index = require('./routes/index')
const genres = require('./routes/genres')
const customers = require('./routes/customers')

const app = express()
const port = process.env.PORT || 3000

app.use(helmet())
app.use(express.json())

app.use('/', index)
app.use('/api/genres', genres)
app.use('/api/customers', customers)

app.listen(port)
