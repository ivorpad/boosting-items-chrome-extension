export const types = {
  SET_MARKET_DATA: 'MARKETPLACE/SET_MARKET_DATA'
}

const defaultState = {
  person: {
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

  const {
    SET_MARKET_DATA
  } = types

  switch (action.type) {
    case SET_MARKET_DATA:
      return { 
        ...state, 
        person: {
          reviewer: action.payload.name,
          author: action.payload.authorName
        },
        item: {
          url: action.payload.itemUrl,
          title: action.payload.itemName,
          id: action.payload.itemId
        }
      };
    default:
      return state;
  }
};

export const actions = { 
  setMarketData: payload => ({ type: types.SET_MARKET_DATA, payload }) 
};