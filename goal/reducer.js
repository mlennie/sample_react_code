const initialState = {}

const goalReducer = (state = initialState, action) => {
  if (action.type === 'GET_GOALS') {
    return Object.assign({}, state, action.payload)
  }

  return state
}

export default goalReducer
