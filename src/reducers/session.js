import {
  ON_LOGIN_REQUEST,
  ON_LOGIN_REQUEST_SUCCESS,
  ON_LOGIN_REQUEST_FAILURE,
  ON_LOGIN_USER_REJECTION,
  ON_SIGN_OUT,
} from '../constants/sagas';

const initialState = {}

export default (state = initialState, action) => {
  switch (action.type) {
    case ON_LOGIN_REQUEST_SUCCESS:
    console.log(action)
      return { 
        ...state,
        access_token: action.payload.access_token,
        isLoggedIn: action.payload.isLoggedIn
       }
    case ON_SIGN_OUT:
      console.log(action)
      return {
        ...state
      }
    case 'ON_LOGIN_ACTION':
      console.log(action)
    return {...state}       
  default:
    return state
  }
}
