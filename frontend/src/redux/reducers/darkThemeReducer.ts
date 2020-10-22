import * as darkThemeActionTypes from "../actions/darkThemeActions/darkThemeActionTypes";
import { LocalStorageItems } from "../../models/LocalStorageItems";

interface IDarkThemeState {
  isDarkTheme: boolean;
}

const initialState: IDarkThemeState = {
  isDarkTheme: false
};

export default (
  state = initialState,
  action: darkThemeActionTypes.DarkThemeActionType
): IDarkThemeState => {
  switch (action.type) {
    case darkThemeActionTypes.SET_IS_DARK_THEME:
      if (action.payload.isDarkTheme) {
        localStorage.setItem(
          LocalStorageItems.isDarkTheme,
          JSON.stringify(action.payload.isDarkTheme)
        );
      }
      return { ...state, isDarkTheme: action.payload.isDarkTheme };

    case darkThemeActionTypes.TOGGLE_DARK_THEME:
      if (!state.isDarkTheme) {
        localStorage.setItem(LocalStorageItems.isDarkTheme, JSON.stringify(!state.isDarkTheme));
      } else {
        localStorage.removeItem(LocalStorageItems.isDarkTheme);
      }
      return { ...state, isDarkTheme: !state.isDarkTheme };

    default:
      return state;
  }
};
