const mongoose = require('mongoose')
const winston = require('winston')

const { MONGO_USER, MONGO_PASS, MONGO_SERVER, MONGO_DATABASE } = process.env
const encodedpass = encodeURIComponent(MONGO_PASS)
const url = `mongodb://${ MONGO_USER }:${ encodedpass }@${ MONGO_SERVER }/${ MONGO_DATABASE }`

mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.set('autoIndex', false)
mongoose.set('toObject', { getters: true })
 
mongoose.connect(url)
  .then(() => winston.info('Connected to Database'))

module.exports = { mongoose, url }
