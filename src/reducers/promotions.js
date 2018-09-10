import {
  FETCH_PROMOTIONS,
  FETCH_PROMOTIONS_SUCCESS,
  SET_PROMOTIONS_PAYLOAD
} from '../constants/restApi';

import { ON_FETCH_ERROR } from '../constants/sagas'

const initiaState = {
  data: [],
  isFetching: true,
  selected: []
};

export default (state = initiaState, action) => {
  switch (action.type) {
    case FETCH_PROMOTIONS:
      return { ...state, isFetching: true };
    case FETCH_PROMOTIONS_SUCCESS:
      return {
        ...state,
        data: action.payload.data,
        isFetching: false
      };
    case SET_PROMOTIONS_PAYLOAD:
      {
        var selected;
        let index;
        if (action.payload.checked) {
          selected = [...state.selected, action.payload.value];
        } else {
          index = state.selected.indexOf(action.payload.value);
          selected = [
            ...state.selected.slice(0, index),
            ...state.selected.slice(index + 1, state.selected.length)
          ];
        }
      }
      return {
        ...state,
        selected
      };
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
  addPromotions: payload => ({ type: SET_PROMOTIONS_PAYLOAD, payload })
};