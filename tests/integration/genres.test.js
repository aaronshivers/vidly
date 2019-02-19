const request = require('supertest')
const { Genre } = require('../../models/genres')

// const { server } = require('../../app')
let server

describe('/api/genres', () => {
  beforeEach(() => server = require('../../app') )
  afterEach(async () => {
    await server.close()
    await Genre.deleteMany()
  })

  describe('GET /', () => {
    it('should return all genres', async () => {
      await Genre.collection.insertMany([
        { name: 'genre1' },
        { name: 'genre2' }
      ])
      const res = await request(server).get('/api/genres')
      
      expect(res.status).toBe(200)
      expect(res.body.length).toBe(2)
      expect(res.body.some(genre => genre.name === 'genre1')).toBeTruthy()
      expect(res.body.some(genre => genre.name === 'genre2')).toBeTruthy()
    })
  })

  describe('GET /:id', () => {
    it('should return genre if valid id is passed', async () => {
      const genre = new Genre({ name: 'genre1' })
      await genre.save(genre)
      const res = await request(server).get(`/api/genres/${genre._id}`)
    
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('name', genre.name)
    })

    it('should return 404 if invalid id is passed', async () => {
      const res = await request(server).get(`/api/genres/1`)

      expect(res.status).toBe(404)
    })
  })
})