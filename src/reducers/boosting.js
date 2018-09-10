const SET_BOOSTING_DATA = "MARKETPLACE/SET_BOOSTING_DATA";

const initialState = {
  boosting: "Good"
}

export default (state = initialState, action) => {
  switch (action.type) {

    case SET_BOOSTING_DATA:

     let boosting;

      switch (action.payload) {
        case 1:
          boosting = 'Great';
          break;
        case 2:
          boosting = 'Exceptional';
          break
        case 3:
          boosting = 'WOW!'
          break
        default:
          boosting = 'Good';
      }
      return { ...state, boosting }

  default:
    return state
  }
}

export const actions = {
  setBoosting: payload => ({ type: SET_BOOSTING_DATA, payload})
}
