import { LOGIN_FAILURE } from "../actions/loginActions";
import { GENERAL_ERROR, HIDE_MESSAGE } from "../actions/errorActions";

const initialState = {
  errorMessage: "",
  showError: false
};

const errorReducer = (state = initialState, action) => {
  switch (action.type) {
    case GENERAL_ERROR:
      return Object.assign({}, state, {
        errorMessage: "Sorry, something went wrong.",
        showError: true
      });
    case LOGIN_FAILURE:
      return Object.assign({}, state, {
        errorMessage: "Login failed, please try again.",
        showError: true
      });
    case HIDE_MESSAGE:
      return Object.assign({}, state, {
        showError: false
      });
    default:
      return state;
  }
};

export default errorReducer;
