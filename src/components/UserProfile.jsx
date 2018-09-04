import React from "react";
import { PageHeader } from "react-bootstrap";

const UserProfile = () => {
  return (
    <React.Fragment>
      <PageHeader>User Profile</PageHeader>
      <ul>
        <li>Name: Jon Doe</li>
        <li>Role: Home Organisation Administrator</li>
        <li>Home organisation: MyOrganisation</li>
      </ul>
    </React.Fragment>
  );
};

export default UserProfile;
