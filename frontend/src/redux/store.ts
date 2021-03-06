import { createStore, combineReducers } from "redux";

import darkThemeReducer from "./reducers/darkThemeReducer";
import mobileSearchFormReducer from "./reducers/mobileSearchFormReducer";
import userReducer from "./reducers/userReducer";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: any;
  }
}

const rootReducer = combineReducers({
  darkTheme: darkThemeReducer,
  mobileSearchForm: mobileSearchFormReducer,
  user: userReducer
});

export type RootState = ReturnType<typeof rootReducer>;

const store = createStore(
  rootReducer,
  process.env.NODE_ENV === "development"
    ? window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    : undefined
);

export default store;
