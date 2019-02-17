const jwt = require('jsonwebtoken')

const createToken = async user => {
  try {
    // Setup JWT and return token
    const payload = { _id: user._id }
    const secret = process.env.JWT_SECRET
    const options = { expiresIn: '1d' }
    return await jwt.sign(payload, secret, options)
  } catch (error) {
    throw new Error (error)
  }
}

module.exports = { createToken }
