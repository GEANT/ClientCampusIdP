import React from "react";
import { Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { Field } from "redux-form";

const Checkbox = props => {
  const { tipp, name, label, text } = props;
  const tooltipp = <Tooltip id="tooltip">{tipp}</Tooltip>;

  return (
    <Row>
      <Col md={2}>
        <b>{label}</b>
      </Col>
      <Col md={10}>
        <OverlayTrigger placement="right" overlay={tooltipp}>
          <Field name={name} type="checkbox" component="input" />
        </OverlayTrigger>
      </Col>
    </Row>
  );
};

export default Checkbox;
