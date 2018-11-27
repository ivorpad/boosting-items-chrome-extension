import {
  ON_LOGIN_INIT_SUCCESS,
  ON_LOGIN_ACTION,
  ON_LOGIN_FAILURE,
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
        access_token: action.token,
        logged: true
       }
    case ON_SIGN_OUT:
      return {
        ...state,
        logged: false
      }
    case AUTH_STATUS_CHECK: 

    const {access_token, logged} = JSON.parse(action.payload)

    return {
      ...state,
      access_token,
      logged: Boolean(logged)
    }    
    case ON_LOGIN_ACTION:
    return {...state}
    case ON_LOGIN_FAILURE:
      return state;
    case 'ON_LOGIN_FAILURE':
      return state;
  default:
    return state
  }
}
