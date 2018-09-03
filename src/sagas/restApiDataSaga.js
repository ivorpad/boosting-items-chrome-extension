import axios from 'axios';
import { takeLatest, call, fork, put } from 'redux-saga/effects';
import { getFromStorageSync, extractDomainName } from "../helpers/helpers";

import {
  FETCH_PROMOTIONS_SUCCESS,
  FETCH_HIGHLIGHTS_SUCCESS
} from "../constants/restApi";

import { ON_FETCH_ERROR, FETCH_API_DATA } from "../constants/sagas";

const fetchApiDataRequest = async (endpoint) => {
  let url = await getFromStorageSync("baseUrlValue");
  return axios
    .get(`https://${url.baseUrlValue}/wp-json/wp/v2/${endpoint}?filter[marketplace]=${extractDomainName(window.location.host)}`)
    .then(response => response)
    .catch(error => {
      throw new Error(error);
    });
}

function *fetchApiDataSaga(action) {
  yield [
    fork(requestAndPut, [fetchApiDataRequest, "post_type_promotion"], actions.fetchApiDataPromotionsSuccess),
    fork(requestAndPut, [fetchApiDataRequest, "post_type_highlight"], actions.fetchApiDataHighlightsSuccess),
  ];
}

function *requestAndPut(request, actionCreator) {
  try {
    const result = yield call(...request);
    yield put(actionCreator(result));
  } catch (e) {
    yield put(actions.failure(e))
  }
}

export function *fetchApiDataSagaWatcher() {
  yield [
    takeLatest(FETCH_API_DATA, fetchApiDataSaga),
  ]
}

export const actions = {
  fetchApiData: () => {
    return { type: FETCH_API_DATA }
  },

  fetchApiDataPromotionsSuccess: (payload) => {
    return { type: FETCH_PROMOTIONS_SUCCESS, payload};
  },

  fetchApiDataHighlightsSuccess: (payload) => {
    return { type: FETCH_HIGHLIGHTS_SUCCESS, payload};
  },

  failure: (error) => {
    return { type: ON_FETCH_ERROR, error };
  },
}