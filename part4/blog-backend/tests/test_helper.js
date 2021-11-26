const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Blog 1',
    author: 'Author 1',
    url: 'https://blog1.com',
    likes: 464,
    user: process.env.TEST_USERID
  },
  {
    title: 'Blog 2',
    author: 'Author 2',
    url: 'https://blog2.com',
    likes: 265,
    user: process.env.TEST_USERID
  },
  {
    title: 'Blog 3',
    author: 'Author 3',
    url: 'https://blog3.com',
    likes: 182,
    user: process.env.TEST_USERID
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs
}

const usersInDb = async () => {
  const users = await User.find({})
  return users
}

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'Blog 3',
    author: 'Author 3',
    url: 'https://blog3.com',
    likes: 182
  })

  await blog.save()
  await blog.remove()

  return blog.id
}

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb,
  nonExistingId
}