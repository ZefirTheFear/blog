import * as userActionTypes from "./userActionTypes";
import { IUser } from "../../../models/IUser";

export const setIsAuth = (isAuth: boolean): userActionTypes.ISetIsAuth => ({
  type: userActionTypes.SET_IS_AUTH,
  payload: { isAuth }
});

export const setUser = (user: IUser | undefined): userActionTypes.ISetUser => ({
  type: userActionTypes.SET_USER,
  payload: { user }
});

export const logout = (): userActionTypes.ILogout => ({
  type: userActionTypes.LOGOUT
});
