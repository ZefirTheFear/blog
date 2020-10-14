import * as darkThemeActionTypes from "../actions/darkThemeActions/darkThemeActionTypes";

interface IDarkTheme {
  isDarkTheme: boolean;
}

const initialState: IDarkTheme = {
  isDarkTheme: false
};

export default (
  state = initialState,
  action: darkThemeActionTypes.DarkThemeActionType
): IDarkTheme => {
  switch (action.type) {
    case darkThemeActionTypes.SET_IS_DARK_THEME:
      if (action.payload.isDarkTheme) {
        localStorage.setItem("isDarkTheme", JSON.stringify(action.payload.isDarkTheme));
      }
      return { ...state, isDarkTheme: action.payload.isDarkTheme };

    case darkThemeActionTypes.TOGGLE_DARK_THEME:
      if (!state.isDarkTheme) {
        localStorage.setItem("isDarkTheme", JSON.stringify(!state.isDarkTheme));
      } else {
        localStorage.removeItem("isDarkTheme");
      }
      return { ...state, isDarkTheme: !state.isDarkTheme };

    default:
      return state;
  }
};
