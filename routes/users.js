const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const { User } = require('../models/users')
const validateUser = require('../utils/validate-user')
const { createToken } = require('../utils/create-token')
const { auth } = require('../middleware/auth')
const validate = require('../middleware/validate')

// GET /
router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password')
  res.send(user)
})

// POST /
router.post('/', validate(validateUser), async (req, res) => {
  const { name, email, password } = req.body

  try {

    // check db for existing user
    const existingUser = await User.findOne({ email })
    if (existingUser) return res.status(400).send('User already registered.')

    // Hash Password
    const saltingRounds = 10
    const hashedPass = await bcrypt.hash(password, saltingRounds)

    // Create and save newUser
    const newUser = { name, email, password: hashedPass }
    const user = await new User(newUser)
    await user.save()

    // Get auth token
    const token = await user.createAuthToken()

    // set header and return user info
    res.header('x-auth-token', token).send({ name, email })

  } catch (error) {
    res.send(error.message)
  }
})

module.exports = router
