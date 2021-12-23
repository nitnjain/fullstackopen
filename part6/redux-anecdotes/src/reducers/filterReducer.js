const filterReducer = (state = '', action) => {
  switch (action.type) {
    case 'CHANGE':
      return action.filter
    default:
      return state
  }
}

export const changeFilter = (filter) => {
  return {
    type: 'CHANGE',
    filter
  }
}

export default filterReducer