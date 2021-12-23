import React from 'react'
import { connect } from 'react-redux'
import { addAnec } from '../reducers/anecdoteReducer'
import { showNotification } from '../reducers/notificationReducer'

const AnecdoteForm = (props) => {
  const addAnecdote = async (e) => {
    e.preventDefault()
    
    props.addAnec(e.target.anecdoteText.value)
    props.showNotification(`You added '${e.target.anecdoteText.value}'`)

    e.target.anecdoteText.value = ''
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div><input name='anecdoteText' /></div>
        <button>create</button>
      </form>
    </div>
  )
}

const mapDispatchToProps = {
  addAnec,
  showNotification
}

export default connect(null, mapDispatchToProps)(AnecdoteForm)