import React from 'react'
import { connect } from 'react-redux'
import { changeFilter } from '../reducers/filterReducer'

const Filter = ({ changeFilter }) => {
  return (
    <div>
      <input onChange={(e) => changeFilter(e.target.value)} />
    </div>
  )
}

const mapDispatchToProps = {
  changeFilter
}

const ConnectedFilter = connect(null, mapDispatchToProps)(Filter)

export default ConnectedFilter