import PropTypes from "prop-types";
import React from "react";
import { Alert, PageHeader } from "react-bootstrap";
import { connect } from "react-redux";
import { SubmissionError } from "redux-form";
import { submitUser, userError, userSubmitted } from "../actions/userActions";
import RegistrationForm from "../forms/RegistrationForm";
import { callApi } from "../utils/api";

class Registration extends React.Component {
  registrationError = {
    userConflict: ""
  };

  createUser = (values, dispatch) => {
    dispatch(submitUser());

    return callApi("/users/register", values, false).then(
      response => {
        dispatch(userSubmitted(response));
      },
      error => {
        dispatch(userError());

        switch (error) {
          case this.registrationError.userConflict:
            throw new SubmissionError({
              hostname: "user already exists",
              _error: "Registration failed"
            });

          default:
            console.error("Unkown error");
            throw new SubmissionError({
              _error: "Unknown error, request failed"
            });
        }
      }
    );
  };

  renderSuccess = username => {
    return (
      <Alert bsStyle="success" style={{ textAlign: "center" }}>
        <p>
          User "{username}" was successully created. <br /> An adminstrator has
          to activate your account before you can use it.
        </p>
      </Alert>
    );
  };

  render() {
    const { username } = this.props;

    return (
      <React.Fragment>
        <PageHeader>{"User registration"}</PageHeader>
        {username && this.renderSuccess(username)}
        <RegistrationForm onSubmit={this.createUser} disabled="true" />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  const { userReducer } = state;
  const { username } = userReducer;

  return { username };
}

Registration.propTypes = {
  username: PropTypes.string
};

export default connect(mapStateToProps)(Registration);
