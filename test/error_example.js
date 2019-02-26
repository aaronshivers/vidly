const request = require('supertest')
const server = require('../app')

describe('error handling', () => {
  it.only('should return a 500', async () => {
    const res = await request(server).get('/api/error')
      .expect(500)
      .expect('Error: If you can see me in stdout, the error handling middleware is working as it should');
  });
});
