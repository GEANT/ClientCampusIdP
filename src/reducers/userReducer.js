import {
  REGISTRATION_REQUEST,
  REGISTRATION_SUCCESS,
  REGISTRATION_FAILURE
} from "../actions/userActions";

const initialState = {
  errorMessage: "",
  isFetching: false,
  username: ""
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTRATION_REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      });
    case REGISTRATION_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        id: action.id,
        username: action.user,
        email: action.email
      });
    case REGISTRATION_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        errorMessage: action.message
      });
    default:
      return state;
  }
};

export default userReducer;
