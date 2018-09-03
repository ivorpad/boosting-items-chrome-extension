import {
  ON_LOGIN_REQUEST,
  ON_LOGIN_REQUEST_SUCCESS,
  ON_LOGIN_REQUEST_FAILURE,
  ON_LOGIN_USER_REJECTION,
} from '../constants/sagas';

const initialState = {}

export default (state = initialState, action) => {
  switch (action.type) {
    case ON_LOGIN_REQUEST_SUCCESS:
    //console.log(action)
      return { 
        ...state,
        access_token: action.payload.access_token,
        isLoggedIn: action.payload.isLoggedIn
       }
  default:
    return state
  }
}
