export const types = {
  FETCH_PROMOTIONS: "PROMOTIONS/FETCH_PROMOTIONS",
  FETCH_PROMOTIONS_SUCCESS: "PROMOTIONS/FETCH_PROMOTIONS_SUCCESS",
  FETCH_PROMOTIONS_ERROR: "PROMOTIONS/FETCH_PROMOTIONS_ERROR"
};

const {
  FETCH_PROMOTIONS,
  FETCH_PROMOTIONS_SUCCESS,
  FETCH_PROMOTIONS_ERROR
} = types;

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_PROMOTIONS:
      return { ...state, isFetching: true };
    case FETCH_PROMOTIONS_SUCCESS:
      return {
        ...state,
        data: action.payload.data,
        isFetching: action.isFetching
      }
    case "ON_FETCH_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

// export const actions = {

// }
