const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((s, i) => s + i.likes, 0)
}

const favoriteBlog = (blogs) => {
  const highestLikes = Math.max(...blogs.map(b => b.likes))
  const favBlog = blogs.find(b => b.likes === highestLikes)
  
  return favBlog;
}

const mostBlogs = (blogs) => {
  const obj = _.countBy(blogs, 'author')
  const author = Object.keys(obj).reduce((a, b) => obj[a] > obj[b] ? a : b)
  return { author, blogs: obj[author] }
}

const mostLikes = (blogs) => {
  const obj = _.groupBy(blogs, 'author')
  const author = Object.keys(obj).reduce((a, b) => obj[a] > obj[b] ? a : b)

  return { author, likes: obj[author].reduce((s,i) => s + i.likes, 0) }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}