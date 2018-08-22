export const types = {
  SET_MARKET_DATA: 'MARKETPLACE/SET_MARKET_DATA'
}

const defaultState = {
  people: {
    reviewer: '',
    author: ''
  },
  item: {
    url: '',
    title: '',
    id: ''
  }
}

export default (state = defaultState, action) => {
  console.log(action, state)

  const {
    SET_MARKET_DATA
  } = types

  switch (action.type) {
    case SET_MARKET_DATA:
      return { 
        ...state, 
        people: action.payload.people,
        item: action.payload.item
      };
    default:
      return state;
  }
};

export const actions = { 
  setMarketData: payload => ({ type: types.SET_MARKET_DATA, payload }) 
};