export const types = {
  FETCH_MARKETPLACES: "MARKETPLACES/FETCH_MARKETPLACES",
  FETCH_MARKETPLACES_SUCCESS: "MARKETPLACES/FETCH_MARKETPLACES_SUCCESS",
  FETCH_MARKETPLACES_ERROR: "MARKETPLACES/FETCH_MARKETPLACES_ERROR"
};

const {
  FETCH_MARKETPLACES,
  FETCH_MARKETPLACES_SUCCESS,
  FETCH_MARKETPLACES_ERROR
} = types;

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_MARKETPLACES_SUCCESS:
      console.log(action);
      return { ...state };
    default:
      return state;
  }
};

