// Three possible states for our logout process as well.
// Since we are using JWTs, we just need to remove the token
// from localStorage. These actions are more useful if we
// were calling the API to log the user out
import { API_TOKEN, ROUTE_ROOT } from "../utils/strings";

export const LOGOUT_PENDING = "LOGOUT_PENDING";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";

function requestLogout() {
  return {
    type: LOGOUT_PENDING,
    isFetching: true
  };
}

function receiveLogout() {
  return {
    type: LOGOUT_SUCCESS,
    isFetching: false,
    isAuthenticated: false,
    user: ""
  };
}

// Logs the user out
export function logoutUser(history) {
  return dispatch => {
    dispatch(requestLogout());
    localStorage.removeItem(API_TOKEN);
    dispatch(receiveLogout());
    history.push(ROUTE_ROOT);
  };
}
