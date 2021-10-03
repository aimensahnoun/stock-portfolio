import { combineReducers } from "redux";

import userReducer from "./user/user.reducer";
import porfolioReducer from "./porfolio/portfolio.reducer";

const rootReducer = combineReducers({
  user: userReducer,
  portfolio: porfolioReducer,
});

export default rootReducer;
