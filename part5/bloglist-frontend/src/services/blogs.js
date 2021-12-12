import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = newToken
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = (blogObj) => {
  const config = {
    headers: { Authorization: `bearer ${token}` }
  }

  const newBlog = {
    title: blogObj.newTitle,
    author: blogObj.newAuthor,
    url: blogObj.newUrl
  }

  const request = axios.post(baseUrl, newBlog, config)
  return request.then(response => response.data)
}

const like = (id, blogObj) => {
  const dataObj = { ...blogObj }
  delete dataObj.id
  dataObj.likes += 1
  dataObj.user = dataObj.user.id

  const request = axios.put(`${baseUrl}/${id}`, dataObj)
  return request.then(response => response.data)
}

const remove = (id) => {
  const config = {
    headers: { Authorization: `bearer ${token}` }
  }

  const request = axios.delete(`${baseUrl}/${id}`, config)
  return request.then(response => response.data)
}

const blogsService = { getAll, create, like, remove, setToken }

export default blogsService