import jwtdecode from "jwt-decode";
import { requestToken } from "../utils/auth";
import { API_TOKEN } from "../utils/strings";

export const LOGIN_REQUEST = "LOGIN_REQUEST";
function requestLogin() {
  return {
    type: LOGIN_REQUEST,
    isFetching: true,
    isAuthenticated: false
  };
}

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export function receiveLogin(user) {
  return {
    type: LOGIN_SUCCESS,
    isFetching: false,
    isAuthenticated: true,
    user: user
  };
}

export const LOGIN_FAILURE = "LOGIN_FAILURE";
export function loginError(message) {
  return {
    type: LOGIN_FAILURE,
    isFetching: false,
    isAuthenticated: false,
    message
  };
}

//Check if the token is still valid and return username on success
const parseToken = token => {
  let decodedToken = jwtdecode(token);

  //Check if the token is still valid
  let tokenExpires = decodedToken.exp * 1000;
  let currentTime = new Date().getTime();

  if (tokenExpires < currentTime) throw new Error("Token is already expired");

  let user = decodedToken.sub;
  if (!user) throw new Error("Invalid Sub value");

  return user;
};

export const loadToken = () => {
  let token = localStorage.getItem(API_TOKEN);

  return dispatch => {
    if (token) {
      try {
        let user = parseToken(token);
        dispatch(receiveLogin(user));
        return true;
      } catch (error) {
        localStorage.removeItem(API_TOKEN);
        console.log("Token restore failed, token was deleted");
        return false;
      }
    }
  };
};

export const loginUser = (username, password) => {
  return dispatch => {
    dispatch(requestLogin());

    requestToken(username, password)
      .then(token => {
        //Check token content
        let user = parseToken(token);

        //Store token in lokal storage
        localStorage.setItem(API_TOKEN, token);

        // Dispatch the success action
        dispatch(receiveLogin(user));
      })
      .catch(error => {
        dispatch(loginError(error));
      });
  };
};
