import {
  ON_LOGIN_INIT,
  ON_LOGIN_INIT_SUCCESS,
  ON_LOGIN_ACTION,
  ON_LOGIN_INIT_FAILURE,
  ON_LOGIN_USER_REJECTION,
  ON_SIGN_OUT,
  AUTH_STATUS_CHECK
} from "../constants/sagas";

const initialState = {}

export default (state = initialState, action) => {
  switch (action.type) {
    case ON_LOGIN_INIT_SUCCESS:
      return { 
        ...state,
        access_token: action.payload,
        logged: true
       }
    case ON_SIGN_OUT:
      console.log(action)
      return {
        ...state,
        logged: false
      }
    case AUTH_STATUS_CHECK: 
    return {
      ...state,
      logged: Boolean(action.logged)
    }    
    case ON_LOGIN_ACTION:
      console.log(action)
    return {...state}       
  default:
    return state
  }
}
