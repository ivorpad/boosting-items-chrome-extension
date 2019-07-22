import { fetchApiDataSagaWatcher } from "./restApiDataSaga";
import { requestAuthWatcher } from "./AuthSaga";
import { sendDataToSheetsSaga, watchDownloadFileChannel } from "./SpreadsheetSaga";

export default function* rootSaga() {
  yield [
    fetchApiDataSagaWatcher(),
    requestAuthWatcher(),
    sendDataToSheetsSaga(),
    watchDownloadFileChannel()
  ];
}
