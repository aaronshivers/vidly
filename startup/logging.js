const winston = require('winston')
require('winston-mongodb')
require('express-async-errors')
const { url } = require('./db')

module.exports = () => {
  // Handle uncaught exceptions
  winston.exceptions.handle(new winston.transports.File({ filename: 'uncaughtExceptions.log', level: 'error'}))

  //Handle unhandled rejections
  process.on('unhandledRejection', exception => {
    throw exception.message
  })

  // Error Logging
  winston.add(new winston.transports.Console({ colorize: true, prettyPrint: true }))
  // winston.add(new winston.transports.Console({ format: winston.format.simple() }))
  winston.add(new winston.transports.File({ filename: 'logfile.log', level: 'error' }))
  winston.add(new winston.transports.MongoDB ({ db: url, level: 'error' }))
}
