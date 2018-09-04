import PropTypes from "prop-types";
import React from "react";
import {
  Button,
  ButtonGroup,
  ButtonToolbar,
  ControlLabel,
  FormControl,
  FormGroup,
  Glyphicon,
  Modal,
  PageHeader,
  Table
} from "react-bootstrap";
import { connect } from "react-redux";
import {
  getIdp,
  getIdpError,
  getIdpSuccess,
  listIdps,
  listIdpsSuccessful,
  requestDeletion
} from "../actions/apiActions";
import { callApi } from "../utils/api";
import { ROUTE_IDP_MANAGE } from "../utils/strings";

class ManageIdP extends React.Component {
  deleteString = "DELETE";

  constructor(props, context) {
    super(props, context);

    this.state = {
      showDialog: false,
      delete: true,
      formValue: "",
      idpID: ""
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;

    this.fetchIdps(dispatch);
    this.loadIdp(dispatch, "idp.munich.de");
  }

  fetchIdps = dispatch => {
    dispatch(listIdps());

    //fetch API

    dispatch(listIdpsSuccessful(this.test()));
  };

  //TEST ONLY
  test = () => {
    let idps = [];
    let idp = {
      id: "442",
      organization: "Example University",
      contacts: [
        {
          contactType: "technical",
          name: "Jon Doe",
          email: "jon.doe@example.edu"
        },
        {
          contactType: "support",
          name: "Jon Doe",
          email: "jon.doe@example.edu"
        }
      ],
      hostname: "example.edu",
      idp: {
        entityID: "https://example.edu/idp",
        sso: {
          public: "abcdefgh"
        }
      },
      metadataProviders: [
        {
          attrID: "12345",
          url: "example.provider.eu",
          publicKey: "yxcvbnm"
        }
      ],
      state: "Pending"
    };
    idps.push(idp);

    return idps;
  };

  closeDeleteDialog = () => {
    this.setState({
      showDialog: false,
      delete: true,
      formValue: "",
      idpID: ""
    });
  };

  showDeleteDialog = idpID => {
    this.setState({
      showDialog: true,
      idpID
    });
  };

  deleteIdP = () => {
    this.props.dispatch(requestDeletion(this.state.idpID));
    this.closeDeleteDialog();
    alert(`IdP ${this.state.idpID} deleted.`);
  };

  getValidationState = () => {
    if (this.state.formValue === this.deleteString) return "success";
    else return null;
  };

  handleChange = value => {
    this.setState({ formValue: value.target.value });

    if (value.target.value === this.deleteString)
      this.setState({ delete: false });
    else this.setState({ delete: true });
  };

  loadIdp = (dispatch, id) => {
    dispatch(getIdp(id));

    return callApi("/idp/" + id, null).then(
      response => {
        let idp = {
          id: response._id,
          organization: "",
          contacts: [
            {
              contactType: "",
              name: "",
              email: ""
            }
          ],
          hostname: "",
          idp: {
            entityID: "",
            sso: {
              public: ""
            }
          },
          metadataProviders: [],
          state: response.status
        };
        dispatch(getIdpSuccess(idp));
      },
      error => {
        dispatch(getIdpError(error.message));
        console.error(error);
      }
    );
  };

  render() {
    const { idps, history } = this.props;

    const idpList = idps.map(idp => {
      return (
        <tr key={idp.id}>
          <td>{idp.id}</td>
          <td>{idp.hostname}</td>
          <td>OpenStack</td>
          <td>{idp.state}</td>
          <th>
            <ButtonToolbar>
              <ButtonGroup>
                <Button
                  onClick={() => history.push(ROUTE_IDP_MANAGE + "/" + idp.id)}
                >
                  <Glyphicon glyph="cog" />
                </Button>
                <Button href={idp.idp.entityID}>
                  <Glyphicon glyph="link" />
                </Button>
                <Button onClick={() => this.showDeleteDialog(idp.id)}>
                  <Glyphicon glyph="trash" />
                </Button>
              </ButtonGroup>
            </ButtonToolbar>
          </th>
        </tr>
      );
    });

    return (
      <div>
        <PageHeader>Manage IdPs</PageHeader>
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Host</th>
              <th>Cloud</th>
              <th>State</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{idpList}</tbody>
        </Table>

        <Modal show={this.state.showDialog} onHide={this.closeDeleteDialog}>
          <Modal.Header closeButton>
            <Modal.Title>Delete IdP</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            Do you really want to delete IdP "{this.state.idpID}
            "?
            <br />
            <br />
            <form>
              <FormGroup
                controlId="formBasicText"
                validationState={this.getValidationState()}
              >
                <ControlLabel>
                  Enter {this.deleteString} to confirm the deletion:
                </ControlLabel>
                <FormControl
                  type="text"
                  value={this.state.formValue}
                  placeholder={this.deleteString}
                  onChange={this.handleChange}
                />
                <FormControl.Feedback />
              </FormGroup>
            </form>
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={this.closeDeleteDialog}>Close</Button>
            <Button
              bsStyle="primary"
              disabled={this.state.delete}
              onClick={this.deleteIdP}
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { authReducer, apiReducer } = state;
  const { isAuthenticated, isFetching } = authReducer;
  const { idps } = apiReducer;

  return {
    isAuthenticated,
    isFetching,
    idps
  };
}

ManageIdP.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  idps: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default connect(mapStateToProps)(ManageIdP);
