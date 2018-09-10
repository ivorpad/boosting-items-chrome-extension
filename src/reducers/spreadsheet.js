import { SET_SPREADSHEET_ID, SEND_DATA_TO_SHEETS } from "../constants/sagas";

const defaultState = {
  sheetId: "",
  payload: {}
}

export default (state = defaultState, action) => {
  switch(action.type) {
    case SET_SPREADSHEET_ID:
      return {
        ...state,
        sheetId: action.id
      }
    case SEND_DATA_TO_SHEETS:
      console.log(action)
    return state    
    default:
      return state
  }
}

export const actions = {
  setSpreadsheetId: (id) => ({ type: SET_SPREADSHEET_ID, id: id })
}