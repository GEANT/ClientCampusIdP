import React from "react";
import { MenuItem, NavDropdown, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const NavigationContent = () => {
  return (
    <React.Fragment>
      <LinkContainer exact to="/">
        <NavItem eventKey={"navigation_content_1"}>Home</NavItem>
      </LinkContainer>
      <NavDropdown eventKey={2} title="IdP" id="basic-nav-dropdown">
        <LinkContainer to="/idp/create">
          <MenuItem eventKey={"navigation_content_2"}>Create IdP</MenuItem>
        </LinkContainer>
        <LinkContainer to="/idp/manage">
          <MenuItem eventKey={"navigation_content_3"}>Manage IdP's</MenuItem>
        </LinkContainer>
      </NavDropdown>
      <LinkContainer to="/federation">
        <MenuItem eventKey={"navigation_content_4"}>Federation</MenuItem>
      </LinkContainer>
    </React.Fragment>
  );
};

export default NavigationContent;
