import React from 'react'
import { connect } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'
import { showNotification } from '../reducers/notificationReducer'

const AnecdoteList = (props) => {
  const { anecdotes } = props
  
  const addVote = (id) => {
    props.vote(id)
    props.showNotification(`You voted '${anecdotes.find(a => a.id === id).content}'`)
  }

  return (
    <div>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => addVote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    anecdotes: state.anecdotes.filter(a => a.content.match(new RegExp(state.filter, 'i'))).sort((a, b) => b.votes - a.votes)
  }
}

const mapDispatchToProps = {
  vote,
  showNotification
}

export default connect(mapStateToProps, mapDispatchToProps)(AnecdoteList)