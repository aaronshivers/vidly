const { ObjectId } = require('mongodb')
const { Genre } = require(`../../models/genres`)

const genres = [{
  _id: new ObjectId().toString(),
  name: 'genre1'
}, {
  _id: new ObjectId().toString(),
  name: 'genre2'
}]

const populateGenres = () => {
  const genre0 = new Genre(genres[0]).save()
  const genre1 = new Genre(genres[1]).save()

  return Promise.all([genre0, genre1])
}

module.exports = { genres, populateGenres }
