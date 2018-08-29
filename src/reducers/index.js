import { combineReducers } from "redux";
import marketplace from './marketplace'
import spreadsheet from "./spreadsheet";
import highlights from "./highlights";
import promotions from "./promotions";

const rootReducer = combineReducers({
  currentItem: marketplace,
  spreadsheet,
  highlights,
  promotions
});
export default rootReducer;