const expect = require('expect')
const request = require('supertest')
const { ObjectId } = require('mongodb')
const server = require('../../app')
const { User } = require('../../models/users')
const { Genre } = require('../../models/genres')
const { genres, populateGenres } = require('./seed')

describe('/api/genres', () => {

  beforeEach(async () => {
    await Genre.deleteMany()
    await populateGenres
  })

  afterEach(async () => {
    await Genre.deleteMany()
    await server.close()
  })

  describe('GET /', () => {
    it('should return all genres', () => {
      
      request(server)
        .get('/api/genres/')
        .expect(200)
        .expect(res => {
          expect(res.body.length).toBe(2)
          expect(res.body.some(genre => genre.name === 'genre1')).toBeTruthy()
          expect(res.body.some(genre => genre.name === 'genre2')).toBeTruthy()
        })
    })
  })

  describe('GET /:id', () => {
    it('should return genre if valid id is passed', () => {
    
      request(server)
        .get(`/api/genres/${genres[0]._id}`)
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('name', genres[0].name)
        })
    })

    it('should return 404 if invalid id is passed', () => {
      request(server)
        .get(`/api/genres/1`)
        .expect(404)
    })

    it('should return 404 if invalid id is passed', () => {
      const id = new ObjectId()
      request(server)
        .get(`/api/genres/${ id }`)
        .expect(404)
    })
  })

  describe('POST /', () => {
    it('should return 401 if client is not logged in', () => {
      request(server)
        .post('/api/genres')
        .send({ name: 'genre' })
        .expect(401)
    })

    it('should return 400 if genre is less than 5 characters', () => {
      const token = new User().createAuthToken()

      request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name: '1234' })
        .expect(400)
    })

    it('should return 400 if genre is more than 50 characters', () => {
      const token = new User().createAuthToken()
      const name = new Array(52).join('a')
      request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name: name })
        .expect(400)
    })

    it('should save the genre if it is valid', () => {
      const token = new User().createAuthToken()
      const genre = { name: 'genre1' }

      request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send(genre)
        .expect(200)
        .end(async res => {
          const foundGenre = await Genre.find(genre)
          expect(foundGenre).not.toBeNull()
        })
    })

    it('should return the genre if it is valid', () => {
      const token = new User().createAuthToken()
      const genre = { name: 'genre1' }

      request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send(genre)
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('_id')
          expect(res.body).toHaveProperty('name', 'genre1')
        })
    })
  })

  describe('PATCH /:id', () => {

    it('should return 401 if client is not logged in', () => {
      request(server)
        .post('/api/genres')
        .send({ name: 'genre' })
        .expect(401)
    })

    it('should return 400 if the update data is invalid', () => {
      const { _id } = genres[0]
      const token = new User().createAuthToken()
      const update = { name: 1234 }

      request(server)
        .patch(`/api/genres/${ _id }`)
        .set('x-auth-token', token)
        .send(update)
        .expect(400)
    })

    it('should update the genre', async () => {
      const { _id } = genres[0]
      const token = new User().createAuthToken()

      request(server)
        .patch(`/api/genres/${ _id }`)
        .set('x-auth-token', token)
        .send({ name: 'updated genre'})
        .expect(200)
        .expect(res => {
          console.log(res.body)
          // expect(res.body)
        })
        .end( res => {
          // const genre = await Genre.find()
          // const genre = await Genre.findById({ _id })
          // console.log(_id)
          // console.log(genre)
          // expect(genre.name).toEqual('updated genre')
        })
    })
  })

  describe('DELETE /:id', () => {

    it('should return 401 if user is not logged in', () => {
      const { _id } = genres[0]

      request(server)
        .delete(`/api/genres/${ _id }`)
        .expect(401)
        .end(async res => {
          const genres = await Genre.find().then
          expect(genres.length).toBe(2)
        })
    })

    it('should return 403 if user is not admin', async () => {
      const { _id } = genres[0]
      const user = { _id: new ObjectId(), isAdmin: false }
      const token = new User(user).createAuthToken()

      const res = await request(server)
        .delete(`/api/genres/${ _id }`)
        .set('x-auth-token', token)
        .expect(403)

        // .end(async res => {
      // const result = await Genre.find()
      // console.log(result)
      // expect(result.length).toBe(2)
        // })//.catch(err => done(err))
    })

    // it('should delete the specified genre', async () => {
    //   const { _id } = genres[0]
    //   const user = { _id: new ObjectId().toString(), isAdmin: true }
    //   const token = await new User(user).createAuthToken()

    //   const res = await request(server)
    //     .delete(`/api/genres/${ _id }`)
    //     .set('x-auth-token', token)

    //   expect(res.status).toBe(200)
    //     // .end(res => {
    //     //   // const genre = await Genre.findById({ _id })
    //   expect(res.genre).toBeFalsy()
    //     //   done()
    //     // })
    // })
  })
})