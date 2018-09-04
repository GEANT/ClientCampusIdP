import React from "react";
import { throwError } from "../actions/errorActions";
import { ROUTE_ROOT } from "../utils/strings";
import { Redirect } from "react-router";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    this.props.dispatch(throwError(error.message));
    this.setState({ hasError: true });
    //this.props.history.push(ROUTE_ROOT);
  }

  renderError = () => {
    this.setState({ hasError: false });
    return <Redirect push to={ROUTE_ROOT} />;
  };

  render() {
    if (this.state.hasError) return this.renderError();
    return this.props.children;
  }
}
