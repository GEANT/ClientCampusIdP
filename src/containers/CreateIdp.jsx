import PropTypes from "prop-types";
import React from "react";
import { PageHeader } from "react-bootstrap";
import { connect } from "react-redux";
import { SubmissionError } from "redux-form";
import {
  requestAccepted,
  requestDenied,
  submitIdp
} from "../actions/apiActions";
import IdpForm from "../forms/IdpForm";
import { callApi } from "../utils/api";
import {
  API_AUTO_GENERATE as auto,
  ROUTE_IDP_CREATE,
  ROUTE_IDP_MANAGE
} from "../utils/strings";

class CreateIdp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { submitProgress: 0 };
  }

  API_ERROR = {
    hostConflict: "host already exist",
    invalidKey: "not a valid PEM key"
  };

  sendRequest = (values, dispatch) => {
    this.setState({ submitProgress: 33 });

    let metadataProviders = [];
    if (values.metadataProviders !== undefined) {
      //metadataProviders = JSON.stringify(values.metadataProviders)
      for (let provider of values.metadataProviders) {
        /*if (!provider.attrID)
                    provider.attrID = auto
                provider.attrID = provider.attrID ? provider.attrID : auto
                provider["@type"] = MetadataProvider
                provider.publicKey["@type"] = "X509Certificate"*/

        //let attrID = provider.attrID ? provider.attrID : auto

        let metadataProvider = {
          "@type": "MetadataProvider",
          attrID: provider.attrID ? provider.attrID : auto,
          url: provider.url,
          publicKey: {
            "@type": "X509Certificate",
            "@value": provider.publicKey
          }
        };

        metadataProviders.push(metadataProvider);
      }
    }

    let contacts = [{ "@type": "Contact", ...values.contact }];
    if (values.contacts !== undefined) {
      for (let contact of values.contacts) {
        let newContact = {
          "@type": "Contact",
          ...contact
        };
        contacts.push(newContact);
      }
    }

    let sso = auto;
    //let ssoPublic = ""
    //let ssoPrivate = ""

    let data = {
      "@context": "http://geant.org/capusidp/context",
      "@type": "ServiceDescription",
      organization: {
        "@type": "Organization",
        name: values.organization,
        contacts
      },
      components: {
        "@type": "Collection",
        web: {
          "@type": "WebServer",
          hostname: values.hostname
        },
        idp: {
          "@type": "IdPConf",
          entityID: {
            "@type": values.idp.generateID ? auto : values.idp.entityID
          },
          metadataProviders,
          sso: {
            "@type": values.idp.sso.generate ? auto : sso
          }
        }
      }
    };

    dispatch(submitIdp());
    this.setState({ submitProgress: 66 });

    return callApi("/idp", data).then(
      response => {
        this.setState({ submitProgress: 100 });
        dispatch(requestAccepted(response.message));
        this.props.history.push(ROUTE_IDP_MANAGE);
      },
      error => {
        this.setState({ submitProgress: 0 });
        dispatch(requestDenied(error));

        switch (error) {
          case this.API_ERROR.hostConflict:
            throw new SubmissionError({
              hostname: "host already exists",
              _error: "Request denied"
            });

          default:
            console.error("Unkown error");
            throw new SubmissionError({
              _error: "Unknown error, request failed"
            });
        }
      }
    );
  };
  getIdp = (idps, idpID) => {
    let idp = null;

    if (idpID) idp = idps.find(idp => idp.id === idpID);

    if (idp === undefined) idp = null;

    return idp;
  };

  render() {
    const { isAuthenticated, idps, match } = this.props;
    const idpID = match.params.id;

    let idp = null;

    if (match.path !== ROUTE_IDP_CREATE) idp = this.getIdp(idps, idpID);

    return (
      <React.Fragment>
        <PageHeader>{idp ? `Update IdP ${idpID}` : "Create an IdP"}</PageHeader>
        <IdpForm
          isAuthenticated={isAuthenticated}
          onSubmit={this.sendRequest}
          idp={idp}
          progress={this.state.submitProgress}
        />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, routeProps) {
  const { authReducer, apiReducer } = state;
  const { isAuthenticated } = authReducer;
  const { idps } = apiReducer;

  return {
    isAuthenticated,
    idps
  };
}

CreateIdp.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  idps: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default connect(mapStateToProps)(CreateIdp);
