import { createStore } from "redux";

import rootReducer from "./root-reducer";

const middleWares = [];

export const store = createStore(rootReducer);
