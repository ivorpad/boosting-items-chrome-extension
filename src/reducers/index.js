import { combineReducers } from "redux";
import marketplace from './marketplace'
import spreadsheet from "./spreadsheet";
import highlights from "./highlights";

const rootReducer = combineReducers({
  marketplace,
  spreadsheet,
  highlights
});
export default rootReducer;