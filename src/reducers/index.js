import { combineReducers } from "redux";
import marketplace from './marketplace'
import spreadsheet from "./spreadsheet";

const rootReducer = combineReducers({
  marketplace,
  spreadsheet
});
export default rootReducer;