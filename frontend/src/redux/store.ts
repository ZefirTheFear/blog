import { createStore, combineReducers } from "redux";

// import scrollReducer from "./reducers/scrollReducer";
import darkThemeReducer from "./reducers/darkThemeReducer";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: any;
  }
}

const rootReducer = combineReducers({
  // scrollState: scrollReducer
  darkTheme: darkThemeReducer
});

export type RootState = ReturnType<typeof rootReducer>;

const store = createStore(
  rootReducer,
  process.env.NODE_ENV === "development"
    ? window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    : undefined
);

export default store;
