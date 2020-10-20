export const SET_IS_DARK_THEME = "SET_IS_DARK_THEME";
export const TOGGLE_DARK_THEME = "TOGGLE_DARK_THEME";

export interface ISetIsDarkTheme {
  type: typeof SET_IS_DARK_THEME;
  payload: {
    isDarkTheme: boolean;
  };
}

export interface IToggleDarkTheme {
  type: typeof TOGGLE_DARK_THEME;
}

export type DarkThemeActionType = ISetIsDarkTheme | IToggleDarkTheme;
