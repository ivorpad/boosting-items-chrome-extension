import { all } from "redux-saga/effects";
import { fetchApiDataSagaWatcher } from "./restApiDataSaga";

export default function* rootSaga() {
  yield [
    fetchApiDataSagaWatcher()
    // add other watchers to the array
  ];
}
