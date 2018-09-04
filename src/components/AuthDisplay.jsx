import PropTypes from "prop-types";
import React from "react";
import { MenuItem, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Login from "./Login";

const AuthDisplay = ({ isAuthenticated, user, onLogin, onLogout }) => {
  if (isAuthenticated) {
    return (
      <NavDropdown
        eventKey={"authdisplay_1"}
        title={user}
        id="basic-nav-dropdown"
      >
        <LinkContainer to="/user/profile">
          <MenuItem eventKey={"authdisplay_2"}>Profile</MenuItem>
        </LinkContainer>
        <LinkContainer to="/user/settings">
          <MenuItem eventKey={"authdisplay_3"}>Settings</MenuItem>
        </LinkContainer>
        <MenuItem eventKey={"authdisplay_4"} onSelect={onLogout}>
          Log out
        </MenuItem>
      </NavDropdown>
    );
  } else {
    return (
      <React.Fragment>
        <LinkContainer to="/user/register">
          <MenuItem eventKey={"authdisplay_5"}>Register</MenuItem>
        </LinkContainer>
        <Login onLogin={onLogin} />
      </React.Fragment>
    );
  }
};

/* Replace DevLogin
<NavItem onSelect={onLogin}>
    <LoginEduGain />
</NavItem>
*/

AuthDisplay.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  user: PropTypes.string,
  onLogin: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired
};

export default AuthDisplay;
