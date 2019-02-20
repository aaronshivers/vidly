const request = require('supertest')
const { server } = require('../../app')
const { User } = require('../../models/users')
const { Genre } = require('../../models/genres')

describe('auth middleware', () => {

  const exec = () => {
    return request(server)
      .post('/api/genres')
      .set('x-auth-token', token)
      .send({ name: 'genre1' })
  }

  beforeEach(() => {
    token = new User().createAuthToken()
  })
  
  afterEach(async () => {
    await Genre.deleteMany()
  })

  it('should return 401 if no token is provided', done => {
    token = ''

    exec()
      .expect(401)
      .end(done)
  })

  it('should return 400 if token is invalid', done => {
    token = 'sadf'

    exec()
      .expect(400)
      .end(done)
  })

  it('should return 200 if token is valid', done => {
    exec()
      .expect(200)
      .end(done)
  })
})