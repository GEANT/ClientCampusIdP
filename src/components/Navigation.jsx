import PropTypes from "prop-types";
import React from "react";
import { MenuItem, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { loginUser } from "../actions/loginActions";
import { logoutUser } from "../actions/logoutActions";
import AuthDisplay from "./AuthDisplay";
import NavigationContent from "./NavigationContent";

const Navigation = ({ dispatch, isAuthenticated, user, history }) => {
  return (
    <Navbar>
      <Navbar.Header>
        <LinkContainer exact to="/">
          <Navbar.Brand>
            <img
              src={require("../images/geant.png")}
              className="img-fluid"
              style={{
                height: 20,
                float: "left",
                marginRight: 10
              }}
              alt=""
            />
            <span style={{ width: 95 }}>Campus IdP</span>
          </Navbar.Brand>
        </LinkContainer>
      </Navbar.Header>
      <Nav>
        {isAuthenticated ? <NavigationContent /> : null}
        <NavDropdown
          eventKey={"navigation_1"}
          title="About"
          id="basic-nav-dropdown"
        >
          <LinkContainer to="/about/what">
            <MenuItem eventKey={"navigation_2"}>Campus IdP</MenuItem>
          </LinkContainer>
          <LinkContainer to="/about/organisations">
            <MenuItem eventKey={"navigation_3"}>Organisations</MenuItem>
          </LinkContainer>
          <LinkContainer to="/about/federations">
            <MenuItem eventKey={"navigation_4"}>Federations</MenuItem>
          </LinkContainer>
        </NavDropdown>
      </Nav>
      <Nav pullRight>
        <AuthDisplay
          eventKey={"navigation_5"}
          isAuthenticated={isAuthenticated}
          user={user}
          onLogin={(username, password) =>
            dispatch(loginUser(username, password))
          }
          onLogout={() => dispatch(logoutUser(history))}
        />
      </Nav>
    </Navbar>
  );
};

Navigation.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  user: PropTypes.string
};

export default Navigation;
