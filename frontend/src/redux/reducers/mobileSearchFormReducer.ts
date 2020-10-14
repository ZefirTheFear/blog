import * as mobileSearchFromActionTypes from "../actions/mobileSearchFormActions/mobileSearchFormActionTypes";

interface IMobileSearchFormState {
  isOpen: boolean;
}

const initialState: IMobileSearchFormState = {
  isOpen: false
};

export default (
  state = initialState,
  action: mobileSearchFromActionTypes.MobileSearchFormActionType
): IMobileSearchFormState => {
  switch (action.type) {
    case mobileSearchFromActionTypes.TOGGLE_MOBILE_SEARCH_FORM:
      return { ...state, isOpen: !state.isOpen };

    default:
      return state;
  }
};
