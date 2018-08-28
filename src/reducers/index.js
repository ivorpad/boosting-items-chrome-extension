import { combineReducers } from "redux";
import marketplace from './marketplace'
import marketplaces from './marketplaces'
import spreadsheet from "./spreadsheet";
import highlights from "./highlights";
import promotions from "./promotions";

const rootReducer = combineReducers({
  // TODO: Change name of reducer
  currentItem: marketplace,
  spreadsheet,
  highlights,
  marketplaces,
  promotions
});
export default rootReducer;