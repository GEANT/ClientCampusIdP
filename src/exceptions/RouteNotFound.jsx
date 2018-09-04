import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Button, Glyphicon, PageHeader, Row, Col } from "react-bootstrap";

const RouteNotFound = ({ location }) => {
  return (
    <React.Fragment>
      <PageHeader>Invalid URL</PageHeader>
      <h3 style={{ textAlign: "center" }}>
        Sorry, the page <code>{location.pathname}</code> doesn't exist
      </h3>
      <Row>
        <Col md={5} />
        <Col md={1}>
          <LinkContainer exact to="/">
            <Button bsStyle="primary">
              <Glyphicon glyph="home" /> Home
            </Button>
          </LinkContainer>
        </Col>
        <Col md={1}>
          <LinkContainer to="/contact">
            <Button bsStyle="primary">
              <Glyphicon glyph="envelope" /> Contact
            </Button>
          </LinkContainer>
        </Col>
        <Col md={5} />
      </Row>
    </React.Fragment>
  );
};

export default RouteNotFound;
