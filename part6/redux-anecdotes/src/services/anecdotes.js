import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createAnec = async (content) => {
  const newObject = { content, votes: 0}
  const response = await axios.post(baseUrl, newObject)
  return response.data
} 

const vote = async (id) => {
  const existingAnec = await axios.get(`${baseUrl}/${id}`)
  const updatedAnec = {
    ...existingAnec.data,
    votes: existingAnec.data.votes + 1
  }

  const response = await axios.put(`${baseUrl}/${id}`, updatedAnec)
  return response.data
}

const anecdoteService = { getAll, createAnec, vote }

export default anecdoteService