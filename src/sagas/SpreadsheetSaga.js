import axios from 'axios';
import { extractDomainName } from "../helpers/helpers";
import { takeLatest, call } from "redux-saga/effects";
import { SEND_DATA_TO_SHEETS, SEND_DATA_TO_SHEETS_INIT } from '../constants/sagas'

const domain = extractDomainName(window.location.host);
const range = `${domain}!A2`;

function *postDataToSpreadsheet({token, sheetId, payload}) {

  if (!token) {
    return;
  }

  const BASE_URL = `https://sheets.googleapis.com/v4/spreadsheets`;
  const SheetApi = yield axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  SheetApi.defaults.headers.post["Authorization"] = `Bearer ${token}`;
  SheetApi.post(`/${sheetId}/values/${range}:append?valueInputOption=USER_ENTERED`, payload)
    .then(response => {
      console.log(response);
    })
    .catch(e => {
      console.log(e.response);
    });
};

function *handleSendDataToSheets(data) {
  yield call(postDataToSpreadsheet, data)
}

export function *sendDataToSheetsSaga() {
  yield takeLatest(SEND_DATA_TO_SHEETS, handleSendDataToSheets)
}

export const actions = {
  sendDataToSheetsInit: (token, sheetId, payload) => ({ type: SEND_DATA_TO_SHEETS_INIT, token, sheetId, payload}),
  sendDataToSheets: (token, sheetId, payload) => ({ type: SEND_DATA_TO_SHEETS, token, sheetId, payload })
};