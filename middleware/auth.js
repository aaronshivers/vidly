const jwt = require('jsonwebtoken')
const { User } = require('../models/users')

const auth = async (req, res, next) => {
  const secret = process.env.JWT_SECRET
  const token = req.header('x-auth-token')
  if (!token) return res.status(401).send('Access Denied! No token provided.')
  
  try {
    req.user = await jwt.verify(token, secret)
    next()
  } catch (error) {
    res.status(400).send('Invalid Token')
  }
}

module.exports = { auth }
