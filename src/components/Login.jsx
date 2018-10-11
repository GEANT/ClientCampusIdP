import PropTypes from "prop-types";
import React from "react";
import {
  Button,
  ControlLabel,
  FormControl,
  FormGroup,
  Modal,
  NavItem
} from "react-bootstrap";

export default class Login extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      showDialog: false,
      user: "",
      password: ""
    };
  }

  login = () => {
    this.props.onLogin(this.state.user, this.state.password);
    this.closeDialog();
  };

  closeDialog = () => {
    this.setState({
      showDialog: false
    });
  };

  showDialog = () => {
    this.setState({
      showDialog: true
    });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    return (
      <React.Fragment>
        <NavItem onSelect={() => this.showDialog()}>Login</NavItem>

        <Modal show={this.state.showDialog} onHide={this.closeDialog}>
          <Modal.Header closeButton>
            <Modal.Title>Login</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form>
              <FormGroup controlId="formBasicText">
                <ControlLabel>Username:</ControlLabel>
                <FormControl
                  id="user"
                  name="user"
                  type="text"
                  value={this.state.user}
                  onChange={this.handleChange}
                  placeholder={"user"}
                />
                <ControlLabel>Password:</ControlLabel>
                <FormControl
                  id="pass"
                  name="password"
                  type="password"
                  value={this.state.password}
                  onChange={this.handleChange}
                  placeholder={"password"}
                />
              </FormGroup>
            </form>
          </Modal.Body>

          <Modal.Footer>
            <Button bsStyle="primary" onClick={this.login}>
              Login
            </Button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
}

Login.propTypes = {
  onLogin: PropTypes.func.isRequired
};
