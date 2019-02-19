const mongoose = require('mongoose')
const winston = require('winston')

let message, database
if (process.env.NODE_ENV === 'test') {
  message = 'Test'
  database = process.env.MONGO_DATABASE_TEST
} else {
  message = 'Development'
  database = process.env.MONGO_DATABASE_DEV
}

const { MONGO_USER, MONGO_PASS, MONGO_SERVER } = process.env
const encodedpass = encodeURIComponent(MONGO_PASS)
const url = `mongodb://${ MONGO_USER }:${ encodedpass }@${ MONGO_SERVER }/${ database }`
// const url = `mongodb://${ MONGO_USER }:${ encodedpass }@${ MONGO_SERVER }/${ MONGO_DATABASE }`

mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.set('autoIndex', false)
mongoose.set('toObject', { getters: true })

mongoose.connect(url)
  .then(() => winston.info(`Connected to ${message} Database`))

module.exports = { mongoose, url }
