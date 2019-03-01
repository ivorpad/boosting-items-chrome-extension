const SET_BOOSTING_DATA = "MARKETPLACE/SET_BOOSTING_DATA";

export default (state = "", action) => {
  switch (action.type) {
    case SET_BOOSTING_DATA:
      let boosting;

      switch (action.payload) {
        case 1:
          boosting = "Good";
          break;
        case 2:
          boosting = "Great";
          break;
        case 3:
          boosting = "Exceptional";
          break;
        case 4:
          boosting = "Wow!";
          break;
        default:
          boosting = "";
      }
      return boosting;

    default:
      return state;
  }
};

export const actions = {
  setBoosting: payload => ({ type: SET_BOOSTING_DATA, payload })
};
