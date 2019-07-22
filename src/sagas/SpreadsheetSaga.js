import { extractDomainName } from "../helpers/helpers";
import { channel } from 'redux-saga';
import { takeLatest, call, put, take } from "redux-saga/effects";
import {
	SEND_DATA_TO_SHEETS,
  SEND_DATA_TO_SHEETS_SUCCESS,
  SEND_DATA_TO_SHEETS_FAILURE
} from '../constants/sagas'

const domain = extractDomainName(window.location.host);
const range = `${domain}!A2`;
const postChannel = channel();
function postDataToSpreadsheet({token, sheetId, payload}) {

  if (!token) {
    return;
  }
  const BASE_URL = `https://sheets.googleapis.com/v4/spreadsheets`;



  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-undef
    chrome.runtime.sendMessage({ type: 'postApiData', baseUrl: BASE_URL, token, sheetId, range, payload }, function (response) {
      if (response.success) {
        postChannel.put(actions.sendDataToSheetsSuccess())
      } else {
        postChannel.put(actions.sendDataToSheetsFailure())
      }
    });
  })
};

function *handleSendDataToSheets(action) {
  yield call(postDataToSpreadsheet, action)
}

export function *sendDataToSheetsSaga() {
  yield takeLatest(SEND_DATA_TO_SHEETS, handleSendDataToSheets)
}

export function* watchDownloadFileChannel() {
  while (true) {
    const action = yield take(postChannel)
    yield put(action)
  }
}

export const actions = {
  sendDataToSheets: (token, sheetId, payload) => ({ type: SEND_DATA_TO_SHEETS, token, sheetId, payload }),
  sendDataToSheetsSuccess: () => ({ type: SEND_DATA_TO_SHEETS_SUCCESS }),
  sendDataToSheetsFailure: () => ({ type: SEND_DATA_TO_SHEETS_FAILURE })
};