import React from "react";
import { Image, Jumbotron } from "react-bootstrap";

const Banner = () => {
  return (
    <Jumbotron
      style={{
        textAlign: "center",
        background: "linear-gradient(to bottom, #A4A5AE, white)"
      }}
    >
      <Image
        src={require("../images/logo.png")}
        responsive
        style={{ marginLeft: "auto", marginRight: "auto" }}
      />
      <h3>The Identity Provider Platform for Research & Education</h3>
    </Jumbotron>
  );
};

export default Banner;
