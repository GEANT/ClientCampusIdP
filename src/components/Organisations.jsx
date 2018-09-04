import React from "react";
import { PageHeader } from "react-bootstrap";

const Organisation = () => {
  return (
    <React.Fragment>
      <PageHeader>Campus IdP for R&E organisations</PageHeader>
      <p>
        The Campus IdP Platform aims to providing Federation Operators (FedOps)
        a way to easily deploy and manage cloud-based Campus IdP for their Home
        Organizations: It integrates tools currently related to the operational
        workflow of federation operators, but belonging however to different
        functional domains (Metadata Management and Archiving, Cloud
        infrastructure, eased IdP configuration, Host Certificates, Software
        Repositories). The overall goal of GEANT providing a Campus IdP platform
        is to ease the daily life of FedOps by integrating in a unique system
        the Management and Archiving of Metadata, installation and configuration
        tools to spawn IdP instances on the Cloud, Monitoring probes, in a
        scalable and convenient fashion. We deal here with the listing of the
        functionality which will be provided by the system to NREN operators to
        support their role of Campus IdP Cloud providers to Home Organizations,
        splitting it into 5 main categories: IdP Metadata Management, IdP
        Configuration, Spawning of new Campus IdP instances, Monitoring,
        Statistics (Campus IdP platform + Jagger).
      </p>
    </React.Fragment>
  );
};

export default Organisation;
