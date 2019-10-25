import {
	SET_SPREADSHEET_ID,
	SEND_DATA_TO_SHEETS,
	SEND_DATA_TO_SHEETS_SUCCESS,
	SEND_DATA_TO_SHEETS_FAILURE
} from "../constants/sagas";

const defaultState = {
  sheetId: "",
  payload: {},
  submitted: false
}

export default (state = defaultState, action) => {
  switch(action.type) {
    case SET_SPREADSHEET_ID:
      return {
        ...state,
        sheetId: action.id
      }
    case SEND_DATA_TO_SHEETS:
    return state
    case SEND_DATA_TO_SHEETS_SUCCESS:
      return {
        ...state,
        buttonText: 'Submitted!',
        submitted: true
      }
    case SEND_DATA_TO_SHEETS_FAILURE:
      return {
        ...state,
        buttonText: 'Error. Try again.',
        submitted: false
      }
    default:
      return state
  }
}

export const actions = {
  setSpreadsheetId: (id) => ({ type: SET_SPREADSHEET_ID, id: id })
}