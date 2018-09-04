import React from "react";
import { Col } from "react-bootstrap";

const TextBlock = ({ title, text }) => {
  return (
    <Col md={4}>
      <h3>{title}</h3>
      <div>
        <b>{text}</b>
      </div>
    </Col>
  );
};

export default TextBlock;
