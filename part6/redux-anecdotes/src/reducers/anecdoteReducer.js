import anecdoteService from '../services/anecdotes'

const anecdoteReducer = (state = [], action) => {
  switch(action.type) {
    case 'VOTE':
      return state.map(a => a.id !== action.id ? a : { ...a, votes: a.votes + 1 })
    case 'ADD':
      return [...state, action.data]
    case 'INIT':
      console.log(action.data)
      return [...action.data]
    default:
      return state
  }
}

export const vote = (id) => {
  return async dispatch => {
    await anecdoteService.vote(id)
    dispatch({
      type: 'VOTE',
      id: id
    })
  }
}

export const initAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: 'INIT',
      data: anecdotes
    })
  }
}

export const addAnec = (content) => {
  return async dispatch => {
    const anecdote = await anecdoteService.createAnec(content)
     dispatch({
      type: 'ADD',
      data: anecdote
    })
  }
}

export default anecdoteReducer