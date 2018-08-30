export const types = {
  FETCH_HIGHLIGHTS: "HIGHLIGHTS/FETCH_HIGHLIGHTS",
  FETCH_HIGHLIGHTS_SUCCESS: "HIGHLIGHTS/FETCH_HIGHLIGHTS_SUCCESS",
  FETCH_HIGHLIGHTS_ERROR: "HIGHLIGHTS/FETCH_HIGHLIGHTS_ERROR",
  SET_HIGHLIGHTS_PAYLOAD: "HIGHLIGHTS/SET_HIGHLIGHTS_PAYLOAD"
};

const {
  FETCH_HIGHLIGHTS,
  FETCH_HIGHLIGHTS_SUCCESS,
  FETCH_HIGHLIGHTS_ERROR,
  SET_HIGHLIGHTS_PAYLOAD
} = types;

const initiaState = {
  data: [],
  isFetching: true,
};


export default (state = initiaState, action) => {
  switch (action.type) {
    case FETCH_HIGHLIGHTS:
      return { ...state, isFetching: true };
    case FETCH_HIGHLIGHTS_SUCCESS:
      return {
        ...state,
        data: action.payload.data,
        isFetching: false
      };
    case SET_HIGHLIGHTS_PAYLOAD:
    console.log(action)
      return {
        ...state
      }
    default:
      return state;
  }
};

export const actions = {
  setHighlights: payload => ({ type: SET_HIGHLIGHTS_PAYLOAD, payload })
};