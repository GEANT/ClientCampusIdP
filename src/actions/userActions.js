export const REGISTRATION_REQUEST = "REGISTRATION_REQUEST";
export function submitUser() {
  return {
    type: REGISTRATION_REQUEST
  };
}

export const REGISTRATION_SUCCESS = "REGISTRATION_SUCCESS";
export function userSubmitted(user) {
  return {
    type: REGISTRATION_SUCCESS,
    id: user["_id"],
    user: user.username,
    email: user.email
  };
}

export const REGISTRATION_FAILURE = "REGISTRATION_FAILURE";
export function userError(message) {
  return {
    type: REGISTRATION_FAILURE,
    message
  };
}
