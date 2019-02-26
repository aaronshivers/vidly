const winston = require('winston')

module.exports = (err, req, res, next) => {
  //winston.error(err.stack)
  console.log(err);

  res.status(500).send(err.toString())
}
