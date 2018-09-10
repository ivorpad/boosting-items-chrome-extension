import { combineReducers } from "redux";
import marketplace from './marketplace'
import spreadsheet from "./spreadsheet";
import highlights from "./highlights";
import promotions from "./promotions";
import session from "./session";
import boosting from "./boosting";
import notices from "./notices";

const rootReducer = combineReducers({
  currentItem: marketplace,
  boosting,
  spreadsheet,
  highlights,
  promotions,
  session,
  notices
});
export default rootReducer;