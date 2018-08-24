export const types = {
  SET_SPREADSHEET_ID: "SPREADSHEET/SET_SPREADSHEET_ID"
};


const defaultState = {
  sheetId: ""
}

const {
  SET_SPREADSHEET_ID
} = types

export default (state = defaultState, action) => {
  switch(action.type) {
    case SET_SPREADSHEET_ID:
      return {
        ...state,
        sheetId: action.id
      }  
    default:
      return state
  }
}

export const actions = {
  setSpreadsheetId: (id) => ({ type: SET_SPREADSHEET_ID, id: id })
}