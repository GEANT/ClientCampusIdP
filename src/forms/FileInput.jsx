import React from "react";
import PropTypes from "prop-types";
import {
  Col,
  ControlLabel,
  FormControl,
  FormGroup,
  Glyphicon,
  HelpBlock,
  InputGroup,
  Tooltip,
  OverlayTrigger,
  Button
} from "react-bootstrap";

const adaptFileEventToValue = delegate => e => delegate(e.target.files[0]);

const FileInput = ({
  input: { name, value: omitValue, onChange, onBlur, ...inputProps },
  meta: omitMeta,
  ...props
}) => (
  <React.Fragment>
    <label htmlFor={name} style={{ margin: 0, padding: 0 }}>
      Browse&nbsp;
    </label>
    <input
      id={name}
      style={{ display: "none" }}
      onChange={adaptFileEventToValue(onChange)}
      onBlur={adaptFileEventToValue(onBlur)}
      type="file"
      {...inputProps}
      {...props}
    />
  </React.Fragment>
);

export default FileInput;
