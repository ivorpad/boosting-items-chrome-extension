import { fetchApiDataSagaWatcher } from "./restApiDataSaga";
import { requestAuthWatcher } from "./AuthSaga";
import { sendDataToSheetsSaga } from "./SpreadsheetSaga";

export default function* rootSaga() {
  yield [
    fetchApiDataSagaWatcher(),
    requestAuthWatcher(),
    sendDataToSheetsSaga()
    // add other watchers to the array
  ];
}
