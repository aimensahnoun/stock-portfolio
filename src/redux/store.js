import { createStore } from "redux";

import rootReducer from "./root_reducer";

const middleWares = [];

export const store = createStore(rootReducer);
