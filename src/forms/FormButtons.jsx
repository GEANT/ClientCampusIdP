import React from "react";
import { Alert, Button, Col, Glyphicon } from "react-bootstrap";
import { PropagateLoader } from "react-spinners";

const FormButtons = props => {
  const {
    disabled,
    submitting,
    pristine,
    reset,
    error,
    submitText = "Create",
    resetText = "Clear"
  } = props;
  return (
    <React.Fragment>
      {!submitting &&
        error && (
          <Alert bsStyle="danger" style={{ textAlign: "center" }}>
            <strong>{error}</strong>
          </Alert>
        )}
      <Col md={3} mdOffset={2}>
        <Button bsStyle="primary" type="submit" disabled={submitting}>
          <Glyphicon glyph="ok" /> {submitText}
        </Button>
      </Col>
      <Col md={1}>
        <PropagateLoader color={"#4d5f7c"} size={20} loading={submitting} />
      </Col>
      <Col md={3}>
        <Button
          type="button"
          className="pull-right"
          disabled={pristine || submitting || disabled}
          onClick={reset}
        >
          <Glyphicon glyph="remove" /> {resetText}
        </Button>
      </Col>
    </React.Fragment>
  );
};

export default FormButtons;
