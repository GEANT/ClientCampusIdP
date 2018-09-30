import React from "react";
import {
  Col,
  ControlLabel,
  FormControl,
  FormGroup,
  Glyphicon,
  HelpBlock,
  InputGroup,
  Tooltip,
  OverlayTrigger
} from "react-bootstrap";
import PropTypes from "prop-types";

const renderField = ({
  input,
  readOnly,
  label,
  type,
  addon,
  glyph,
  checkbox,
  button,
  tipp,
  submitting,
  meta: { touched, error, warning },
  ...rest
}) => {
  let getValidationState = () => {
    let validationState = null;

    if (touched) {
      validationState = error ? "error" : warning ? "warning" : "success";
    }

    return validationState;
  };

  const fb = type => {
    if (
      type === "text" ||
      type === "number" ||
      type === "email" ||
      type === "date"
    )
      return true;
    else return false;
  };

  const renderInput = (
    <InputGroup>
      {(addon || glyph) && (
        <InputGroup.Addon>
          {addon}
          {glyph && <Glyphicon glyph={glyph} />}
        </InputGroup.Addon>
      )}
      <FormControl
        readOnly={readOnly || submitting}
        {...input}
        {...rest}
        type={type}
      />
      {fb(type) && <FormControl.Feedback />}
      {checkbox && <InputGroup.Addon>{checkbox}</InputGroup.Addon>}
      {button && <InputGroup.Button>{button}</InputGroup.Button>}
    </InputGroup>
  );

  const tooltipp = <Tooltip id="tooltip">{tipp}</Tooltip>;

  const renderTooltipp = (
    <OverlayTrigger placement="right" overlay={tooltipp}>
      {renderInput}
    </OverlayTrigger>
  );

  return (
    <FormGroup
      className="show-grid"
      controlId="formBasicText"
      validationState={getValidationState()}
    >
      <Col md={2}>
        <ControlLabel>{label}</ControlLabel>
      </Col>
      <Col md={7}>{tipp ? renderTooltipp : renderInput}</Col>
      <Col md={3}>
        {touched &&
          ((error && <HelpBlock>{error}</HelpBlock>) ||
            (warning && <HelpBlock>{warning}</HelpBlock>))}
      </Col>
    </FormGroup>
  );
};

renderField.propTypes = {
  touched: PropTypes.bool,
  addon: PropTypes.string,
  glyp: PropTypes.string,
  labe: PropTypes.string,
  type: PropTypes.string,
  tipp: PropTypes.string,
  readOnly: PropTypes.bool
};

export default renderField;
