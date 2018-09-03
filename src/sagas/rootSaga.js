import { fetchApiDataSagaWatcher } from "./restApiDataSaga";
import { requestAuthWatcher } from "./AuthSaga";

export default function* rootSaga() {
  yield [
    fetchApiDataSagaWatcher(),
    requestAuthWatcher()
    // add other watchers to the array
  ];
}
