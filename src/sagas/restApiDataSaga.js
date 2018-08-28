import axios from 'axios';
import { types as HighlightTypes } from '../reducers/highlights'
import { types as PromotionTypes } from '../reducers/promotions'
import { types as MarketplacesTypes } from "../reducers/marketplaces";
import { takeLatest, call, fork, put, all } from 'redux-saga/effects';
import { getFromStorageSync } from '../helpers/helpers'

const { FETCH_HIGHLIGHTS, FETCH_HIGHLIGHTS_SUCCESS } = HighlightTypes;
const { FETCH_PROMOTIONS, FETCH_PROMOTIONS_SUCCESS } = PromotionTypes;
const { FETCH_MARKETPLACES, FETCH_MARKETPLACES_SUCCESS } = MarketplacesTypes;

const fetchApiDataRequestPromotions = async () => {
  let url = await getFromStorageSync("baseUrlValue");
  return axios.get(`https://${url.baseUrlValue}/wp-json/wp/v2/post_type_promotion`);
}

const fetchApiDataRequestHighlights = async () => {
  let url = await getFromStorageSync("baseUrlValue");
  return axios.get(`https://${url.baseUrlValue}/wp-json/wp/v2/post_type_highlight`);
}

const fetchApiDataRequestMarketplaces = async () => {
  let url = await getFromStorageSync("baseUrlValue");
  return axios.get(`https://${url.baseUrlValue}/wp-json/wp/v2/marketplace`);
}


function* fetchApiDataSaga(action) {
  try {
    //let payload = yield call(fetchApiDataRequest, action.endpoint);
    //const { data } = payload;
    //yield put(actions.fetchApiDataSuccess(payload, action.endpoint));

    yield all([
      fork(requestAndPut, fetchApiDataRequestPromotions, actions.fetchApiDataPromotionsSuccess),
      fork(requestAndPut, fetchApiDataRequestHighlights, actions.fetchApiDataHighlightsSuccess),
      fork(requestAndPut, fetchApiDataRequestMarketplaces, actions.fetchApiDataMarketplacesSuccess),
    ]);

  } catch (error) {
    console.log(error)
  }
}

function* requestAndPut(request, actionCreator) {
  const result = yield call(request);
  yield put(actionCreator(result));
}

export function* fetchApiDataSagaWatcher() {
  yield [
    takeLatest(FETCH_PROMOTIONS, fetchApiDataSaga),
    takeLatest(FETCH_HIGHLIGHTS, fetchApiDataSaga),
    takeLatest(FETCH_MARKETPLACES, fetchApiDataSaga)
  ]
}

export const actions = {
  fetchApiDataPromotions: endpoint => {
    return { type: FETCH_PROMOTIONS, endpoint }
  },

  fetchApiDataHighlights: endpoint => {
    return { type: FETCH_HIGHLIGHTS, endpoint }
  },

  fetchApiDataMarketplaces: endpoint => {
    return { type: FETCH_MARKETPLACES, endpoint }
  },

  fetchApiDataPromotionsSuccess: (payload) => {
    return { type: FETCH_PROMOTIONS_SUCCESS, payload: payload };
  },

  fetchApiDataHighlightsSuccess: (payload) => {
    return { type: FETCH_HIGHLIGHTS_SUCCESS, payload: payload };
  },

  fetchApiDataMarketplacesSuccess: (payload) => {
    return { type: FETCH_MARKETPLACES_SUCCESS, payload: payload };
  }
};