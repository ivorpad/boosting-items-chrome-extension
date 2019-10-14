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

  return new Promise(() => {
    // eslint-disable-next-line no-undef
    const sending = browser.runtime.sendMessage({ type: 'postApiData', baseUrl: BASE_URL, token, sheetId, range, payload });
    sending.then(({ok, item}) => {


      if (ok) {
        localStorage.setItem('submitInfo', JSON.stringify({ ok, item }))
        postChannel.put(actions.sendDataToSheetsSuccess())
      } else {
        localStorage.setItem('submitInfo', JSON.stringify({ ok, item }))
        postChannel.put(actions.sendDataToSheetsFailure())
      }
    })
  })
};

function *handleSendDataToSheets(action) {
  yield call(postDataToSpreadsheet, action)
}

export function *sendDataToSheetsSaga() {
  yield takeLatest(SEND_DATA_TO_SHEETS, handleSendDataToSheets)
}

export function* watchSentDataToApiChannel() {
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