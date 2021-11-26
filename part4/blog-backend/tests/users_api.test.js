const supertest = require('supertest')
const app = require('../app');
const helper = require('./test_helper')
const mongoose = require('mongoose')
const api = supertest(app)

describe('adding a new user', () => {
  test('invalid users are not created', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'xy',
      password: 'pw',
      name: ''
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    const usersInEnd = await helper.usersInDb()
    expect(usersInEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})