const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const { User } = require('../models/users')
const { validateAuth } = require('../utils/validate-auth')
const { createToken } = require('../utils/create-token')

// POST /
router.post('/', async (req, res) => {
  const { email, password } = req.body

  // Validate user provided info
  const { error } = validateAuth({ email, password })
  if (error) return res.status(400).send(error.details[0].message)

  // check db for existing user
  const user = await User.findOne({ email })
  if (!user) return res.status(400).send('Invalid Email or Password.')

  // Validate Password
  const validPass = bcrypt.compare(password, user.password)
  if (!validPass) return res.status(400).send('Invalid Email or Password.')

  // Get auth token
  const token = await user.createAuthToken()

  // set header and return user info
  res.header('x-auth-token', token).send(token)
})

module.exports = router
