import React from "react";
import TimezonePicker from "react-bootstrap-timezone-picker";
import "react-bootstrap-timezone-picker/dist/react-bootstrap-timezone-picker.min.css";
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

const renderTimezone = ({
  input: { onChange, value },
  data,
  valueField,
  textField
}) => (
  <TimezonePicker
    absolute={false}
    placeholder="Select timezone..."
    value={value}
    onChange={onChange}
  />
);

export default renderTimezone;
