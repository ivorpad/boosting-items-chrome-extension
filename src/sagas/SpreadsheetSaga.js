import axios from 'axios';
import { extractDomainName } from "../helpers/helpers";
import { takeLatest, call, put } from "redux-saga/effects";
import {
	SEND_DATA_TO_SHEETS,
  SEND_DATA_TO_SHEETS_SUCCESS,
  SEND_DATA_TO_SHEETS_FAILURE
} from '../constants/sagas'

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

  let success;

  SheetApi.defaults.headers.post["Authorization"] = `Bearer ${token}`;
  yield SheetApi.post(`/${sheetId}/values/${range}:append?valueInputOption=USER_ENTERED`, payload)
    .then(response => {
      success = true;
      console.log(response);
    })
    .catch(e => {
      success = false;
      console.log(e.response);
    });

    if(success) {
      yield put(actions.sendDataToSheetsSuccess())
    } else {
      yield put(actions.sendDataToSheetsFailure())
    }

};

function *handleSendDataToSheets(action) {
  yield call(postDataToSpreadsheet, action)
}

export function *sendDataToSheetsSaga() {
  yield takeLatest(SEND_DATA_TO_SHEETS, handleSendDataToSheets)
}

export const actions = {
  sendDataToSheets: (token, sheetId, payload) => ({ type: SEND_DATA_TO_SHEETS, token, sheetId, payload }),
  sendDataToSheetsSuccess: () => ({ type: SEND_DATA_TO_SHEETS_SUCCESS }),
  sendDataToSheetsFailure: () => ({ type: SEND_DATA_TO_SHEETS_FAILURE })
};