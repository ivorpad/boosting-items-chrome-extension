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

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_PROMOTIONS_SUCCESS:
      return action.payload.data;
    default:
      return state;
  }
};

// export const actions = {

// }
