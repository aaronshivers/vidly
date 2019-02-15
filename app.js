const express = require('express')

const index = require('./routes/index')
const genres = require('./routes/genres')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.use('/', index)
app.use('/api/genres', genres)

app.listen(port)
