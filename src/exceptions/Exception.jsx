import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Button, Glyphicon, PageHeader } from "react-bootstrap";

const Exception = (header, text) => {
  return (
    <React.Fragment>
      <PageHeader>{header}</PageHeader>
      <h3 style={{ textAlign: "center" }}>{text}</h3>
      <div>
        <LinkContainer exact to="/">
          <Button bsStyle="primary">
            <Glyphicon glyph="home" /> Home
          </Button>
        </LinkContainer>
        <LinkContainer to="/contact">
          <Button bsStyle="primary">
            <Glyphicon glyph="envelope" /> Contact
          </Button>
        </LinkContainer>
      </div>
    </React.Fragment>
  );
};

export default Exception;
