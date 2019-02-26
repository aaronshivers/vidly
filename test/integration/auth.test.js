const request = require('supertest')
const { User } = require('../../models/users')
const { Genre } = require('../../models/genres')

describe('auth middleware', () => {
  let server

  const exec = () => {
    return request(server)
      .post('/api/genres')
      .set('x-auth-token', token)
      .send({ name: 'genre1' })
  }

  beforeEach(() => {
    server = require('../../app')
    token = new User().createAuthToken()
  })
  
  afterEach(async () => {
    await server.close()
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