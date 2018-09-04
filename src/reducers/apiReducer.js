import {
  CREATE_IDP_PENDING,
  CREATE_IDP_FULFILLED,
  CREATE_IDP_FAILURE,
  REQUEST_IDPS_PENDING,
  LIST_IDPS_FULFILLED,
  LIST_IDPS_ERROR,
  DELETE_IDP_FULFILLED,
  GET_IDP_PENDING,
  GET_IDP_ERROR,
  GET_IDP_FULFILLED
} from "../actions/apiActions";

const initialState = {
  isFetching: false,
  idps: []
};

const apiReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_IDP_PENDING:
      return Object.assign({}, state, {
        isFetching: true
      });
    case CREATE_IDP_FULFILLED:
      return Object.assign({}, state, {
        isFetching: false,
        message: action.message
      });
    case CREATE_IDP_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        error: action.error
      });
    case REQUEST_IDPS_PENDING:
      return Object.assign({}, state, {
        isFetching: true
      });
    case LIST_IDPS_FULFILLED:
      return Object.assign({}, state, {
        isFetching: false,
        idps: action.idps
      });
    case LIST_IDPS_ERROR:
      return Object.assign({}, state, {
        isFetching: false,
        error: action.error
      });
    case DELETE_IDP_FULFILLED: {
      let idps = state.idps.map(idp => {
        if (idp.id === action.idpID) idp.state = "Deleted";

        return idp;
      });

      return Object.assign({}, state, {
        isFetching: false,
        idpID: action.idpID,
        idps
      });
    }
    case GET_IDP_PENDING:
      return Object.assign({}, state, {
        isFetching: true
      });
    case GET_IDP_ERROR:
      return Object.assign({}, state, {
        isFetching: false,
        error: action.error
      });
    case GET_IDP_FULFILLED: {
      return Object.assign({}, state, {
        isFetching: false,
        idps: [...state.idps, action.idp]
      });
    }
    default:
      return state;
  }
};

export default apiReducer;
