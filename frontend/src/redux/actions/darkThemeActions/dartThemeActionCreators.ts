import * as darkThemeActionTypes from "./darkThemeActionTypes";

export const setIsDarkTheme = (isDarkTheme: boolean): darkThemeActionTypes.ISetIsDarkTheme => ({
  type: darkThemeActionTypes.SET_IS_DARK_THEME,
  payload: {
    isDarkTheme
  }
});

export const toggleDarkTheme = (): darkThemeActionTypes.IToggleDarkTheme => ({
  type: darkThemeActionTypes.TOGGLE_DARK_THEME
});
