require('dotenv').config()

const express = require('express')
const app = express()
const winston = require('winston')

const { mongoose } = require('./startup/db')
require('./startup/logging')()
require('./startup/routes')(app)

const port = process.env.PORT || 3000

const server = app.listen(port, () => winston.info(`Server listening on port ${port}.`))

module.exports = { server }
