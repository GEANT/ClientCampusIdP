import { createStore, combineReducers, applyMiddleware } from "redux";
import { reducer as formReducer } from "redux-form";
import { logger } from "redux-logger";
import thunkMiddleware from "redux-thunk";
import authReducer from "./reducers/authReducer";
import apiReducer from "./reducers/apiReducer";
import errorReducer from "./reducers/errorReducer";
import promiseMiddleware from "redux-promise-middleware";
import { CREATE_IDP_FULFILLED } from "./actions/apiActions";
import createHistory from "history/createBrowserHistory";
import userReducer from "./reducers/userReducer";

export const history = createHistory();

const middleware = applyMiddleware(
  promiseMiddleware(),
  thunkMiddleware,
  logger
);

const reducer = combineReducers({
  authReducer,
  apiReducer,
  errorReducer,
  userReducer,
  form: formReducer.plugin({
    createNewIdP: (state, action) => {
      switch (action.type) {
        case CREATE_IDP_FULFILLED:
          return undefined;
        default:
          return state;
      }
    }
  })
});

export default createStore(reducer, middleware);
