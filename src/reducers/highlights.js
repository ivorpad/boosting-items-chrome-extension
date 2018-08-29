export const types = {
  FETCH_HIGHLIGHTS: "HIGHLIGHTS/FETCH_HIGHLIGHTS",
  FETCH_HIGHLIGHTS_SUCCESS: "HIGHLIGHTS/FETCH_HIGHLIGHTS_SUCCESS",
  FETCH_HIGHLIGHTS_ERROR: "HIGHLIGHTS/FETCH_HIGHLIGHTS_ERROR"
};

const {
  FETCH_HIGHLIGHTS,
  FETCH_HIGHLIGHTS_SUCCESS,
  FETCH_HIGHLIGHTS_ERROR
} = types;

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_HIGHLIGHTS:
      return {...state,  isFetching: true}
    case FETCH_HIGHLIGHTS_SUCCESS:
      return {
        ...state,
        data: action.payload.data,
        isFetching: action.isFetching
      }
    default:
      return state;
  }
};