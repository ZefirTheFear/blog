import { IUser } from "../../models/IUser";
import * as userActionTypes from "../actions/userActions/userActionTypes";
import { LocalStorageItems } from "../../models/LocalStorageItems";

interface IUserState {
  isAuth: boolean;
  user: IUser | undefined;
}

const initialState: IUserState = {
  isAuth: false,
  user: undefined
};

export default (state = initialState, action: userActionTypes.UserActionType): IUserState => {
  switch (action.type) {
    case userActionTypes.SET_IS_AUTH:
      return { ...state, isAuth: action.payload.isAuth };

    case userActionTypes.SET_USER:
      return { ...state, user: action.payload.user };

    case userActionTypes.LOGOUT:
      localStorage.removeItem(LocalStorageItems.jwtToken);
      localStorage.removeItem(LocalStorageItems.expiryDate);
      return { ...state, user: undefined, isAuth: false };

    default:
      return state;
  }
};
