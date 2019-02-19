require('dotenv').config()
const jwt = require('jsonwebtoken')
const { User } = require('../../../models/users')
const mongoose = require('mongoose')

describe('user.createAuthToken', () => {
  it('should return a valid JWT', () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true
    }
    const user = new User(payload)
    const token = user.createAuthToken()
    const secret = process.env.JWT_SECRET
    const decoded = jwt.verify(token, secret)
    expect(decoded).toMatchObject(payload)
  })
})