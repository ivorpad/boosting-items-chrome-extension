import axios from 'axios';
import { types as HighlightTypes } from '../reducers/highlights'
import { types as PromotionTypes } from '../reducers/promotions'
import { takeLatest, call, fork, put } from 'redux-saga/effects';
import { getFromStorageSync, extractDomainName } from "../helpers/helpers";

const { FETCH_HIGHLIGHTS_SUCCESS, FETCH_HIGHLIGHTS_ERROR } = HighlightTypes;
const { FETCH_PROMOTIONS_SUCCESS, FETCH_PROMOTIONS_ERROR } = PromotionTypes;

const types = {
  FETCH_API_DATA: "SAGAS/FETCH_API_DATA",
  ON_FETCH_ERROR: "SAGAS/ON_FETCH_ERROR"
};

const {
  FETCH_API_DATA,
  ON_FETCH_ERROR
} = types

const fetchApiDataRequest = async (endpoint) => {
  let url = await getFromStorageSync("baseUrlValue");
  return axios
    .get(`https://${url.baseUrlValue}/wp-json/wp/v2/${endpoint}?filter[marketplace]=${extractDomainName(window.location.host)}`)
    .then(response => response)
    .catch(error => error);
}

function* fetchApiDataSaga(action) {
  yield [
    fork(requestAndPut, [fetchApiDataRequest, "post_type_promotion"], actions.fetchApiDataPromotionsSuccess),
    fork(requestAndPut, [fetchApiDataRequest, "post_type_highlight"], actions.fetchApiDataHighlightsSuccess),
  ];
}

// TODO: Add error handling
function* requestAndPut(request, actionCreator) {
  const result = yield call(...request);
  yield put(actionCreator(result));
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

  fetchApiDataPromotionsError: (error) => {
    return { type: ON_FETCH_ERROR, error };
  }
}