import React from "react";
import { Col, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const Tile = ({ title, subtitle, text, image, offset, link }) => {
  return (
    <Link to={link}>
      <Col
        md={4}
        mdOffset={offset}
        style={{
          textAlign: "center",
          border: "2px solid black",
          backgroundColor: "WhiteSmoke"
        }}
      >
        <h3>{title}</h3>
        <Image
          src={require("../images/" + image)}
          circle
          responsive
          style={{ margin: "2em auto", width: "85%", height: "20em" }}
        />
        <h3>{subtitle}</h3>
        <p>{text}</p>
      </Col>
    </Link>
  );
};

Tile.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  text: PropTypes.string,
  image: PropTypes.string,
  offset: PropTypes.number,
  link: PropTypes.string
};

export default Tile;
