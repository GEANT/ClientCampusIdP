import React from "react";
import { PageHeader, Grid, Row } from "react-bootstrap";
import TextBlock from "./TextBlock";

const Federations = () => {
  return (
    <React.Fragment>
      <PageHeader>Campus IdP for federations</PageHeader>
      <Grid>
        <Row>
          <TextBlock
            title={"Metadata Management"}
            text={
              "Create/Store all required IdP configuration including metadata certificates Display as well as update of IdP metadata via GUI and provide easy configuration options for relevant IdP config features"
            }
          />
          <TextBlock
            title={"IdP Configuration"}
            text={`Provide IdP configuration required to spawn a new instance. Generation of IdP metadata files, to be shipped to the IdP instance on the Cloud for its configuration Management of IdP configuration via API service Management of configuration changes to update the running config on managed IdP instances`}
          />
          <TextBlock
            title={"Monitoring & Statistics"}
            text={`Deploy on the IdP instances plugins towards Monitoring tools to track the status of the instances. Provide statistics on session-related information: set of top peering Service Providers`}
          />
        </Row>
      </Grid>
    </React.Fragment>
  );
};

export default Federations;
