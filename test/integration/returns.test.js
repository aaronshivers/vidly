const expect = require('expect')
const request = require('supertest')
const moment = require('moment')
const { ObjectId } = require('mongodb')
const server = require('../../app')
const { Rental } = require('../../models/rentals')
const { User } = require('../../models/users')
const { Movie } = require('../../models/movies')

describe('/api/returns', () => {
  let token, movieId, customerId, rental, movie

  const exec = () => {
    return request(server)
      .post('/api/returns')
      .set('x-auth-token', token)
      .send({ customerId, movieId })
  }

  // const populateRentals = () => {
  //   customerId = new ObjectId().toString()
  //   movieId = new ObjectId().toString()
  //   token = new User().createAuthToken()
    
  //   rental = {
  //     customer: {
  //       _id: customerId,
  //       name: '12345',
  //       phone: '1234567890'
  //     },
  //     movie: {
  //       _id: movieId,
  //       title: '12345',
  //       dailyRentalRate: 2,
  //     }
  //   }
  //   new Rental(rental).save()
  // }

  beforeEach(async () => {
    customerId = new ObjectId()
    movieId = new ObjectId()
    token = new User().createAuthToken()

    movie = new Movie({
      _id: movieId,
      title: movieId,
      genre: { name: '12345' },
      dailyRentalRate: 2,
      numberInStock: 3
    })
    await movie.save()
    
    rental = new Rental({
      customer: {
        _id: customerId,
        name: '12345',
        phone: '1234567890'
      },
      movie: {
        _id: movieId,
        title: '12345',
        dailyRentalRate: 2
      }

    })
    await rental.save()
  })

  afterEach(async () => {
    await Rental.deleteMany()
    await Movie.deleteMany()
  })

  it('should return 401 if client is not logged in', async () => {
    token = ''

    await exec().expect(401)
  })

  it('should return 400 if customerId is not provided', async () => {
    customerId = ''
    
    await exec().expect(400)
  })

  it('should return 400 if movieId is not provided', async () => {
    movieId = ''
    
    await exec().expect(400)
  })

  it('should return 404 if no rental found for this customer/movie', async () => {
    await Rental.deleteMany()
    await exec().expect(404)
  })

  it('should return 400 if rental is already processed', async () => {    
    rental.dateIn = new Date()

    await rental.save()

    await exec().expect(400)
  })

  it('should return 200 if request is valid', async () => {
    await exec().expect(200)
  })

  it('should set the dateIn if input is valid', async () => {
    await exec()

    const foundRental = await Rental.findOne(rental._id)
    const diff = new Date() - foundRental.dateIn
    expect(diff).toBeLessThan(10000)
  })

  it('should set the rental fee if data is valid', async () => {
    rental.dateOut = moment().add(-7, 'days').toDate()
    await rental.save()

    await exec()

    const foundRental = await Rental.findOne(rental._id)
    expect(foundRental.rentalFee).toBe(14)
  })

  it('should increase the stock if data is valid', async () => {
    await exec()

    const foundMovie = await Movie.findById(movieId)

    expect(foundMovie.numberInStock).toBe(movie.numberInStock + 1)
  })

  it('should return the rental if input is valid', async () => {
    const res = await exec()

    const foundRental = await Rental.findById(rental._id)

    expect(Object.keys(res.body))
      .toEqual(expect.arrayContaining([
        'dateOut',
        'dateIn',
        'rentalFee',
        'customer',
        'movie'
      ]))
  })


})