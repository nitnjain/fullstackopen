const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  console.log('you need to set TEST_USERID & TEST_TOKEN in env before running the tests.')
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
  const promiseArr = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArr)
})

test('blogs are being returned properly', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('blogs have the id property', async() => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})

describe('adding a new blog', () => {
  test('valid blog is added and returns 201', async() => {
    const newBlog = {
      title: 'Newly added blog',
      author: 'Author of a new blog',
      url: 'https://newblog.link',
      likes: 46
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${process.env.TEST_TOKEN}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain('Newly added blog')
  })

  test('defaults likes to 0 if likes are undefined', async () => {
    const newBlog = {
      title: 'Newly added blog',
      author: 'Author of a new blog',
      url: 'https://newblog.link'
    }

    const addedBlog = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${process.env.TEST_TOKEN}`)
      .send(newBlog)
    expect(addedBlog.body.likes).toBe(0)
  })

  test('returns 400 if title or url are missing', async () => {
    const missingTitleBlog = {
      author: 'nitin',
      url: 'https://blogurl.link',
      likes: 0
    }

    const missingUrlBlog = {
      title: 'Blog with no url',
      author: 'nitin',
      likes: 0
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${process.env.TEST_TOKEN}`)
      .send(missingTitleBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)

      await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${process.env.TEST_TOKEN}`)
      .send(missingUrlBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

  test('returns 401 if a token is not provided', async () => {
    const newBlog = {
      title: 'Newly added blog',
      author: 'Author of a new blog',
      url: 'https://newblog.link',
      likes: 46
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })

  test('returns 401 if a valid token is not provided', async () => {
    const newBlog = {
      title: 'Newly added blog',
      author: 'Author of a new blog',
      url: 'https://newblog.link',
      likes: 46
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${process.env.TEST_TOKEN}makeThisInvalid`)
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })
})

describe('deleting a blog', () => {
  test('works when deleting a blog using valid id', async () => {
    const blogsInStart = await helper.blogsInDb()

    const blogToDelete = blogsInStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${process.env.TEST_TOKEN}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)
  })
})

describe('updating a blog', () => {
  test('works when using a valid id', async () => {
    const blogsInStart = await helper.blogsInDb()

    const blogToEdit = blogsInStart[0]

    await api
      .put(`/api/blogs/${blogToEdit.id}`)
      .send({ title: 'Updated title', author: 'Updated author', likes: 564})
      .expect(200)

    const updatedBlog = await api.get(`/api/blogs/${blogToEdit.id}`)
    expect(updatedBlog.body.title).toBe('Updated title')
  })
})

afterAll(() => {
  mongoose.connection.close()
})