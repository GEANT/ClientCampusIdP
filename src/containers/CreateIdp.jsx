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

  //Helper function to convert a file to base64
  base64 = file => {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onerror = () => {
        reader.abort();
        reject(new DOMException("Problem parsing input file."));
      };

      reader.onload = () => {
        resolve(reader.result.slice(23));
      };
      reader.readAsDataURL(file);
    });
  };

  //Submit IdP request to API
  sendRequest = async (values, dispatch) => {
    //Prepare array of metadata providers
    let metadataProviders = [];
    if (values.metadataProviders !== undefined) {
      for (let provider of values.metadataProviders) {
        let metadataProvider = {
          "@type": "MetadataProvider",
          attrID: provider.attrID ? provider.attrID : auto,
          url: provider.url,
          publicKey: {
            "@type": "X509Certificate",
            "@value": provider.cert
          }
        };

        metadataProviders.push(metadataProvider);
      }
    }

    //Prepare array of contact persons
    let contacts = [];
    for (let contact of values.contacts) {
      let newContact = {
        "@type": "Contact",
        ...contact
      };
      contacts.push(newContact);
    }

    //Prepare SSO key
    let sso = values.sso.generate
      ? [
          {
            "@type": "KeyDescriptor",
            use: "signing",
            publicKey: {
              "@type": "X509Certificate",
              "@value": values.sso.signing.cert
            },
            privateKey: values.sso.signing.key
          },
          {
            "@type": "KeyDescriptor",
            use: "encryption",
            publicKey: {
              "@type": "X509Certificate",
              "@value": values.sso.encryption.cert
            },
            privateKey: values.sso.encryption.key
          }
        ]
      : { "@type": auto };

    //Convert logo file to BASE64
    let logo = values.logoUpload
      ? await this.base64(values.logoUpload)
      : values.logo;

    //Convert favicon file to BASE64
    let favicon = values.faviconUpload
      ? await this.base64(values.faviconUpload)
      : values.favicon;

    //Prepare JSON body
    let data = {
      "@context": "http://geant.org/capusidp/context",
      "@type": "ServiceDescription",
      organization: {
        "@type": "Organization",
        name: values.organization.name,
        url: values.organization.url,
        contacts,
        logo: logo
      },
      components: {
        "@type": "Collection",
        web: {
          "@type": "WebServer",
          hostname: values.hostname,
          timezone: values.timezone,
          favicon: favicon
        },
        idp: {
          "@type": "IdPConf",
          entityID: values.idp.generateID
            ? { "@type": auto }
            : values.idp.entityID,
          entityCategories: {
            coco: values.organization.coco,
            "research-and-scholarship": values.organization.entityCategories
          },
          metadataProviders,
          sso: {
            certificates: sso,
            scopes: values.scopes.map(item => item["scope"])
          }
        }
      }
    };

    dispatch(submitIdp());

    //Submit IdP request to API
    return callApi("/idp", "POST", data).then(
      response => {
        dispatch(requestAccepted(response.message));
        this.props.history.push(ROUTE_IDP_MANAGE);
      },
      error => {
        dispatch(requestDenied(error));

        //Return UI error
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

    if (idpID) idp = idps.find(idp => idp.name === idpID);

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

function mapStateToProps(state) {
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
