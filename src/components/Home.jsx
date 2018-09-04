import React from "react";
import { Grid, Row } from "react-bootstrap";
import Banner from "../components/Banner";
import {
  ROUTE_ABOUT_FEDERATION,
  ROUTE_ABOUT_ORGANISATION
} from "../utils/strings";
import Tile from "./Tile";

const Home = () => {
  return (
    <React.Fragment>
      <Banner />
      <Grid>
        <Row>
          <Tile
            title="Home Organizations"
            subtitle="Get your own IdP"
            text="Support local administrators in spawning an Identity Provider for their organisation to centrally manage users and seamlessly join a federation."
            image="organisation2.jpg"
            link={ROUTE_ABOUT_ORGANISATION}
            offset={1}
          />
          <Tile
            title="Federations"
            subtitle="Manage your Federation"
            text="Support Federation Operators in their role of Cloud Identity Providers, allowing them to easily manage organisations in the federation."
            image="federation3.jpg"
            link={ROUTE_ABOUT_FEDERATION}
            offset={2}
          />
        </Row>
      </Grid>
    </React.Fragment>
  );
};

export default Home;
