import PropTypes from "prop-types";
import React from "react";
import { Alert } from "react-bootstrap";
import { connect } from "react-redux";
import { Route, Switch, withRouter } from "react-router-dom";
import { hideError } from "../actions/errorActions";
import { loadToken } from "../actions/loginActions";
import About from "../components/About";
import Federations from "../components/Federations";
import Home from "../components/Home";
import Navigation from "../components/Navigation";
import Organisations from "../components/Organisations";
import UserProfile from "../components/UserProfile";
import UserSettings from "../components/UserSettings";
import ErrorBoundary from "../exceptions/ErrorBoundary";
import RouteNotFound from "../exceptions/RouteNotFound";
import { ROUTE_ROOT } from "../utils/strings";
import CreateIdp from "./CreateIdp";
import ManageIdP from "./ManageIdP";
import Registration from "./Registration";

class App extends React.Component {
  componentDidMount() {
    const { dispatch, history, isAuthenticated } = this.props;

    dispatch(loadToken());
    if (!isAuthenticated) history.push(ROUTE_ROOT);
  }

  render() {
    const {
      dispatch,
      isAuthenticated,
      errorMessage,
      showError,
      user,
      history
    } = this.props;

    return (
      <ErrorBoundary dispatch={dispatch}>
        <Navigation
          isAuthenticated={isAuthenticated}
          user={user}
          dispatch={dispatch}
          history={history}
          style={{ marginBottom: 0 }}
        />
        {showError && (
          <Alert
            bsStyle="danger"
            style={{ textAlign: "center", marginBottom: 0 }}
            onDismiss={() => dispatch(hideError())}
          >
            <strong>{errorMessage}</strong>
          </Alert>
        )}
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/idp/create" component={CreateIdp} />
          <Route path="/idp/manage/:id" component={CreateIdp} />
          <Route path="/idp/manage" component={ManageIdP} />
          <Route path="/user/register" component={Registration} />
          <Route path="/user/profile" component={UserProfile} />
          <Route path="/user/settings" component={UserSettings} />
          <Route path="/about/what" component={About} />
          <Route path="/about/organisations" component={Organisations} />
          <Route path="/about/federations" component={Federations} />
          <Route component={RouteNotFound} />
        </Switch>
      </ErrorBoundary>
    );
  }
}

//<Redirect to="/error" />
//<Route path="/error" render={(title, error) => <Exception header={title} text={error} />} />

function mapStateToProps(state) {
  const { authReducer, errorReducer } = state;
  const { isAuthenticated, user } = authReducer;
  const { errorMessage, showError } = errorReducer;

  return {
    isAuthenticated,
    errorMessage,
    showError,
    user
  };
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  user: PropTypes.string,
  errorMessage: PropTypes.string,
  showError: PropTypes.bool
};

export default withRouter(connect(mapStateToProps)(App));
