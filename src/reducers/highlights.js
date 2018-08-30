import {
  FETCH_HIGHLIGHTS,
  FETCH_HIGHLIGHTS_SUCCESS,
  FETCH_HIGHLIGHTS_ERROR,
  SET_HIGHLIGHTS_PAYLOAD
} from "../constants/restApi";

import { ON_FETCH_ERROR } from "../constants/saga";

const initiaState = {
  data: [],
  isFetching: true,
  selected: []
};


export default (state = initiaState, action) => {
  switch (action.type) {
    case FETCH_HIGHLIGHTS:
      return { ...state, isFetching: true };
    case FETCH_HIGHLIGHTS_SUCCESS:
      return {
        ...state,
        data: action.payload.data,
        isFetching: false
      };
    case SET_HIGHLIGHTS_PAYLOAD:
      let selected = [...action.payload.selectedOptions].map( option => option.innerText )
      return {
        ...state,
        selected: selected
      }
    case ON_FETCH_ERROR:
      console.log(action)
      return {
        ...state
      }  
    default:
      return state;
  }
};

export const actions = {
  setHighlights: payload => ({ type: SET_HIGHLIGHTS_PAYLOAD, payload })
};