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
  submitApproval,
  approvalSuccess,
  approvalError,
  listIdps,
  listIdpsSuccessful,
  listIdpsError,
  submitDeletion,
  deletionError,
  deletionSuccessful
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
    this.fetchIdps();
  }

  fetchIdps = () => {
    const { listIdps, listIdpsSuccessful, listIdpsError } = this.props;
    listIdps();

    callApi("/idp", "GET").then(
      response => {
        listIdpsSuccessful(response.members);
        /*for (let idp of response.members) {
          this.loadIdp(idp.name);
        }*/
      },
      error => {
        listIdpsError(error.message);
      }
    );
  };

  loadIdp = name => {
    const { getIdp, getIdpSuccess, getIdpError } = this.props;
    getIdp(name);

    return callApi("/idp/" + name, "GET").then(
      response => {
        let idp = {
          id: response._id,
          name: response.name,
          status: response.status,
          fetched: true
        };
        getIdpSuccess(idp);
      },
      error => {
        getIdpError(error.message);
      }
    );
  };

  approveIdp = name => {
    const { submitApproval, approvalSuccess, approvalError } = this.props;
    const data = { task: "ansible" };

    submitApproval(name);
    callApi("/tasks/idp/" + name, "POST", data).then(
      response => {
        approvalSuccess(name);
      },
      error => {
        approvalError(error);
      }
    );
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

  deleteIdp = name => {
    const { submitDeletion, deletionSuccessful, deletionError } = this.props;
    submitDeletion(name);
    callApi("/idp/" + name, "DELETE").then(
      response => {
        deletionSuccessful(name);
        this.closeDeleteDialog();
      },
      error => {
        deletionError(error);
      }
    );
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

  render() {
    const { idps, history } = this.props;

    const idpList = idps.map(idp => {
      return (
        <tr key={idp.name}>
          <td>{idp.id}</td>
          <td>{idp.name}</td>
          <td>OpenStack</td>
          <td>{idp.status}</td>
          <th>
            <ButtonToolbar>
              <ButtonGroup>
                <Button
                  disabled={!idp.fetched}
                  onClick={() =>
                    history.push(ROUTE_IDP_MANAGE + "/" + idp.name)
                  }
                >
                  <Glyphicon glyph="cog" />
                </Button>
                <Button
                  disabled={idp.status !== "deployed" || !idp.fetched}
                  href={idp.name}
                >
                  <Glyphicon glyph="link" />
                </Button>
                <Button
                  disabled={idp.status === "deleted"}
                  onClick={() => this.showDeleteDialog(idp.name)}
                >
                  <Glyphicon glyph="trash" />
                </Button>
                {idp.status === "pending" && (
                  <Button onClick={() => this.approveIdp(idp.name)}>
                    <Glyphicon glyph="ok" />
                  </Button>
                )}
              </ButtonGroup>
            </ButtonToolbar>
          </th>
        </tr>
      );
    });

    //Delete IdP dialog
    const dialog = (
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
            onClick={() => this.deleteIdp(this.state.idpID)}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    );

    return (
      <React.Fragment>
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
        {dialog}
      </React.Fragment>
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
  isAuthenticated: PropTypes.bool.isRequired,
  idps: PropTypes.arrayOf(PropTypes.object).isRequired,
  listIdps: PropTypes.func.isRequired,
  listIdpsSuccessful: PropTypes.func.isRequired,
  listIdpsError: PropTypes.func.isRequired,
  submitDeletion: PropTypes.func.isRequired,
  deletionSuccessful: PropTypes.func.isRequired,
  deletionError: PropTypes.func.isRequired,
  submitApproval: PropTypes.func.isRequired,
  approvalSuccess: PropTypes.func.isRequired,
  approvalError: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  {
    listIdps,
    listIdpsSuccessful,
    listIdpsError,
    submitDeletion,
    deletionSuccessful,
    deletionError,
    submitApproval,
    approvalSuccess,
    approvalError
  }
)(ManageIdP);
