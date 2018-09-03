import { combineReducers } from "redux";
import marketplace from './marketplace'
import spreadsheet from "./spreadsheet";
import highlights from "./highlights";
import promotions from "./promotions";
import session from "./session";

const rootReducer = combineReducers({
  currentItem: marketplace,
  spreadsheet,
  highlights,
  promotions,
  session
});
export default rootReducer;