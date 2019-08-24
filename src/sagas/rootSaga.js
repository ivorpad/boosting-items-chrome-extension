import { fetchApiDataSagaWatcher } from "./restApiDataSaga";
import { requestAuthWatcher } from "./AuthSaga";
import { sendDataToSheetsSaga, watchSentDataToApiChannel } from "./SpreadsheetSaga";

export default function* rootSaga() {
  yield [
    fetchApiDataSagaWatcher(),
    requestAuthWatcher(),
    sendDataToSheetsSaga(),
    watchSentDataToApiChannel()
  ];
}
