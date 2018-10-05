import React from "react";
import { PageHeader, Grid, Row } from "react-bootstrap";
import TextBlock from "./TextBlock";

const Organisation = () => {
  return (
    <React.Fragment>
      <PageHeader>Campus IdP for R&E organisations</PageHeader>
      <Grid>
        <Row>
          <TextBlock
            title="Create an IdP"
            text="The Campus IdP Platform aims to providing Operators
            a way to easily deploy and manage cloud-based Campus IdP
            for their Home Organizations: It integrates tools currently related
            to the operational workflow of federation operators, but belonging
            however to different functional domains (Metadata Management and
            Archiving, Cloud infrastructure, eased IdP configuration, Host
            Certificates, Software Repositories)."
          />
          <TextBlock
            title="Manage your IdP"
            text="The overall goal of GEANT
          providing a Campus IdP platform is to ease the daily life of FedOps
          by integrating in a unique system the Management and Archiving of
          Metadata, installation and configuration tools to spawn IdP
          instances on the Cloud, Monitoring probes, in a scalable and
          convenient fashion."
          />
        </Row>
      </Grid>
    </React.Fragment>
  );
};

export default Organisation;
