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
  deleteIdp,
  deleteIdpSuccessful,
  deleteIdpError,
  approveIdp
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
  }

  fetchIdps = dispatch => {
    dispatch(listIdps());

    return callApi("/idp", null, true, "GET").then(
      response => {
        dispatch(listIdpsSuccessful(response.members));
        for (let idp of response.members) {
          this.loadIdp(dispatch, idp.name);
        }
      },
      error => {
        dispatch(getIdpError(error.message));
        console.error(error);
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

  deleteIdP = () => {
    let name = this.state.idpID;
    this.props.dispatch(deleteIdp(name));

    return callApi("/idp/" + name, null, true, "DELETE").then(
      response => {
        this.props.dispatch(deleteIdpSuccessful(name));
        console.log(response);
        this.closeDeleteDialog();
      },
      error => {
        this.props.dispatch(deleteIdpError(name));
        console.error(error);
        this.closeDeleteDialog();
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

  loadIdp = (dispatch, name) => {
    dispatch(getIdp(name));

    return callApi("/idp/" + name, null, true, "GET").then(
      response => {
        let idp = {
          id: response._id,
          name: response.name,
          status: response.status,
          fetched: true
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
                  <Button onClick={() => approveIdp(idp.name)}>
                    <Glyphicon glyph="ok" />
                  </Button>
                )}
              </ButtonGroup>
            </ButtonToolbar>
          </th>
        </tr>
      );
    });

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
  dispatch: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  idps: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default connect(mapStateToProps)(ManageIdP);
