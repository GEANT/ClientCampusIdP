import axios from "axios";
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
      } catch (error) {
        localStorage.removeItem(API_TOKEN);
        console.log("Token restore failed, token was deleted");
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

// Calls the API to get a token and
// dispatches actions along the way
export function loginUser2(creds) {
  let config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  };

  const username = "mschmidt";
  const password = "mSchmidt12IAz!";
  let data = "name=" + username + "&password=" + password;

  let endpoint = "/authenticate";

  return dispatch => {
    // We dispatch requestLogin to kickoff the call to the API
    dispatch(requestLogin());

    return axios
      .post(endpoint, data, config)
      .then(response => {
        let token = response.data.token;

        //Check if the response contains a token
        if (!token)
          throw new Error("The response does not contain an access token");

        //Check token content
        let user = parseToken(token);

        //Store token in lokal storage
        localStorage.setItem(API_TOKEN, token);

        // Dispatch the success action
        dispatch(receiveLogin(user));
      })
      .catch(function(error) {
        dispatch(loginError(error.message));

        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
        return Promise.reject(error);
      });
  };
}
