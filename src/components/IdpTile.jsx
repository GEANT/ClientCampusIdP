import React from "react";
import PropTypes from "prop-types";
import { Col, Image } from "react-bootstrap";
import { propTypes } from "redux-form";

const IdpTile = ({ number }) => {
  return (
    <Col md={3} mdOffset={1} style={{ border: "2px solid black" }}>
      <Image
        src={require("../images/openstack.png")}
        responsive
        style={{ margin: "2em auto" }}
      />
      <hr />
      <table>
        <tbody>
          <tr>
            <td>ID</td>
            <td>12345</td>
          </tr>
          <tr>
            <td>Hostname:</td>
            <td>lrz.de</td>
          </tr>
          <tr>
            <td>Environment </td>
            <td>OpenStack</td>
          </tr>
          <tr>
            <td>State</td>
            <td>Pending</td>
          </tr>
          <tr>
            <td>Action</td>
            <td>..</td>
          </tr>
        </tbody>
      </table>
    </Col>
  );
};

IdpTile.propTypes = {
  number: PropTypes.number
};

export default IdpTile;
