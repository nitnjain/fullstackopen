const notificationReducer = (state = '', action) => {
  switch(action.type) {
    case 'SET':
      return action.message
    case 'UNSET':
      return ''
    default:
      return state
  }
}

export const setNotification = (message) => {
  return {
    type: 'SET',
    message
  }
}

export const unsetNotification = () => {
  return {
    type: 'UNSET',
  }
}

let timeId = 0
export const showNotification = (message) => {
  return async dispatch => {
    clearTimeout(timeId)
    dispatch({ type: 'SET', message })
    timeId = setTimeout(() => {
      dispatch({ type: 'UNSET' })
    }, 5000)
  }
}

export default notificationReducer