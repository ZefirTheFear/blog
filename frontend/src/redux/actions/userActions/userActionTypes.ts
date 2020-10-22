import { IUser } from "../../../models/IUser";

export const SET_IS_AUTH = "SET_IS_AUTH";
export const SET_USER = "SET_USER";
export const LOGOUT = "LOGOUT";

export interface ISetIsAuth {
  type: typeof SET_IS_AUTH;
  payload: {
    isAuth: boolean;
  };
}

export interface ISetUser {
  type: typeof SET_USER;
  payload: {
    user: IUser | undefined;
  };
}

export interface ILogout {
  type: typeof LOGOUT;
}

export type UserActionType = ISetIsAuth | ISetUser | ILogout;
