import React from "react";
import {
  Button,
  Col,
  Form,
  Glyphicon,
  Grid,
  ListGroup,
  ListGroupItem,
  Panel,
  ProgressBar,
  Row
} from "react-bootstrap";
import { connect } from "react-redux";
import { Field, FieldArray, formValueSelector, reduxForm } from "redux-form";
import FormButtons from "./FormButtons";
import renderField from "./renderField";
import PropTypes from "prop-types";

const auto = "auto generated";
const contactTypes = {
  admin: "administrative",
  support: "support",
  tech: "technical"
};

//Field validators
const required = value => (value ? undefined : "Required");
const email = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? "Invalid email address"
    : undefined;
const domain = value =>
  value &&
  !/^(https:\/\/)?([a-z0-9]+\.)?[a-z0-9][a-z0-9-]*\.[a-z]{2,6}$/i.test(value)
    ? "Invalid address"
    : undefined;
//const host = (value) => value && !/^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$/i.test(value) ? 'Invalid hostname (RFC 1123)' : undefined
//const number = (value) => value && isNaN(Number(value)) ? 'Must be a number' : undefined
//const text = (value) => value && !/^[a-zA-Z]+$/i.test(value) ? 'Only letters are allowed' : undefined
const validEntitiyID = value =>
  value && !(/^https:\/\/.+\/.+/i.test(value) || value === auto)
    ? "Invalid entitiy ID"
    : undefined;

//Field normalizers
const updateEntityID = (value, previousValue, allValues) => {
  let prefix = `https://${allValues["hostname"]}/`;

  if (!value) return prefix;
  else if (value === auto || value.startsWith(prefix)) return value;
  else if (previousValue.startsWith(prefix) && !value.startsWith(prefix))
    return previousValue;
  else return prefix + value;
};

const updateProviderURL = (value, previousValue, allValues) => {
  const prefix = "https://";

  if (!value || value === undefined) return prefix;
  else if (value.startsWith(prefix)) return value;
  else if (
    previousValue &&
    previousValue.startsWith(prefix) &&
    !value.startsWith(prefix)
  )
    return previousValue;
  else return prefix + value;
};

let IdpForm = props => {
  const {
    handleSubmit,
    idp,
    progress,
    change,
    generateId,
    generateKeys,
    ...rest
  } = props;

  const toggleEntityID = (event, value) => {
    if (value) {
      change("idp.entityID", auto);
    } else {
      change("idp.entityID", "");
    }
  };

  const toggleSSO = (event, value) => {
    change("idp.sso.public", " ");
    change("idp.sso.private", " ");
    if (value) {
      change("idp.sso.public", auto);
      change("idp.sso.private", auto);
    } else {
      change("idp.sso.public", "");
      change("idp.sso.private", "");
    }
  };

  /*const handleHostChange(event, value) => {
        
    }*/

  const renderMetadata = ({
    fields,
    meta: { touched, error, submitFailed }
  }) => (
    <Panel>
      <Panel.Heading>
        <Button
          className="pull-right"
          onClick={() => fields.push({ url: "https://" })}
        >
          <Glyphicon glyph="plus" /> Add
        </Button>
        <h4>Metadata Providers</h4>
      </Panel.Heading>
      <ListGroup>
        {fields.map((metadataProviders, index) => (
          <ListGroupItem key={index}>
            <Button className="pull-right" onClick={() => fields.remove(index)}>
              <Glyphicon glyph="trash" />
            </Button>
            <h4>Metadata Provider #{index + 1}</h4>
            <Field
              name={`${metadataProviders}.attrID`}
              type="text"
              placeholder="example"
              label="Attribute ID"
              glyph="globe"
              component={renderField}
            />
            <Field
              name={`${metadataProviders}.url`}
              type="text"
              placeholder="https://metadata.example.org"
              label="URL"
              addon="@"
              component={renderField}
              normalize={updateProviderURL}
              validate={[required, domain]}
            />
            <Field
              name={`${metadataProviders}.publicKey`}
              type="text"
              label="Public key"
              glyph="eye-close"
              componentClass="textarea"
              rows="5"
              placeholder={samplePublicKey}
              component={renderField}
              validate={[required]}
            />
          </ListGroupItem>
        ))}
      </ListGroup>
    </Panel>
  );

  const renderContacts = ({
    fields,
    meta: { touched, error, submitFailed }
  }) => (
    <ListGroup>
      {fields.map((contact, index) => (
        <ListGroupItem key={index}>
          {index ? (
            <Button className="pull-right" onClick={() => fields.remove(index)}>
              <Glyphicon glyph="trash" />
            </Button>
          ) : (
            <Button
              className="pull-right"
              onClick={() => fields.push({ contactType: contactTypes.admin })}
            >
              <Glyphicon glyph="plus" />
              Add contact
            </Button>
          )}
          <Field
            name={`${contact}.contactType`}
            componentClass="select"
            label="Type"
            glyph="th-list"
            readOnly={!index}
            component={renderField}
            validate={required}
          >
            {index && (
              <option value={contactTypes.admin}>Administrative</option>
            )}
            {index && <option value={contactTypes.support}>Support</option>}
            <option value={contactTypes.tech}>Technical</option>
          </Field>
          <Field
            name={`${contact}.name`}
            type="text"
            placeholder="Jon Doe"
            label="Person"
            glyph="user"
            component={renderField}
            validate={required}
          />
          <Field
            name={`${contact}.email`}
            type="email"
            placeholder="jon.doe@university.org"
            label="Email"
            glyph="envelope"
            component={renderField}
            validate={[required, email]}
          />
        </ListGroupItem>
      ))}
    </ListGroup>
  );

  return (
    <div className="well well-sm">
      <Form horizontal onSubmit={handleSubmit}>
        <Grid>
          <Panel>
            <Panel.Heading>
              <h4>General information</h4>
            </Panel.Heading>
            <Panel.Body>
              <Field
                name="organization"
                type="text"
                placeholder="University of Europe"
                label="Organization"
                glyph="home"
                component={renderField}
              />
              <Row className="show-grid">
                <Col md={2}>
                  <strong>Contacts persons:</strong>
                </Col>
                <Col md={7} />
              </Row>
              <FieldArray name="contacts" component={renderContacts} />
            </Panel.Body>
          </Panel>
          <Panel>
            <Panel.Heading>
              <Panel.Title componentClass="h4">Identity Provider</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
              <Field
                name="hostname"
                type="text"
                placeholder="idp.example.org"
                label="Host URL"
                onChange={(event, value) =>
                  generateId
                    ? null
                    : change("idp.entityID", `https://${value}/`)
                }
                glyph="globe"
                component={renderField}
                validate={[required, domain]}
              />
              <Field
                name="idp.entityID"
                type="custom"
                placeholder="https://idp.example.org/idp"
                label="Entity Identifier"
                addon="@"
                checkbox={() => (
                  <Field
                    name="idp.generateID"
                    type="checkbox"
                    label="Generate Entity ID"
                    onChange={toggleEntityID}
                    component="input"
                  />
                )}
                readOnly={generateId}
                component={renderField}
                normalize={updateEntityID}
                validate={[required, validEntitiyID]}
              />
              <Field
                name="idp.sso.public"
                type="textarea"
                placeholder={samplePublicKey}
                label="SSO Public key"
                glyph="eye-open"
                checkbox={() => (
                  <Field
                    name="idp.sso.generate"
                    type="checkbox"
                    onChange={toggleSSO}
                    component="input"
                  />
                )}
                readOnly={generateKeys}
                componentClass="textarea"
                rows="7"
                component={renderField}
                validate={[required]}
              />
              <Field
                name="idp.sso.private"
                type="textarea"
                placeholder={samplePrivateKey}
                label="SSO Private key"
                glyph="eye-close"
                checkbox={() => (
                  <Field
                    name="idp.sso.generate"
                    type="checkbox"
                    onChange={toggleSSO}
                    component="input"
                  />
                )}
                readOnly={generateKeys}
                componentClass="textarea"
                rows="7"
                component={renderField}
                validate={[required]}
              />
            </Panel.Body>
          </Panel>
          <FieldArray name="metadataProviders" component={renderMetadata} />
          {progress > 0 ? <ProgressBar active now={progress} /> : null}
          <FormButtons
            {...rest}
            submitText={idp ? "Update IdP" : "Create IdP"}
          />
        </Grid>
      </Form>
    </div>
  );
};

const samplePrivateKey = `-----BEGIN RSA PRIVATE KEY-----
        pIIVOFMDG+KESnAFV7l2c+cnzRMW0+b6f8mR1CJzZuxVLL6Q02fvLi55/mbSYxECQQDeAw6fiIQX\
        AkEAxCL5HQb2bQr4ByorcMWm/hEP2MZzROV73yF41hPsRC9m66KrheO9HPTJuo3/9s5p+sqGxOlF\
        37sJ5QsW+sJyoNde3xH8vdXhzU7eT82D6X/scw9RZz+/6rCJ4p0=
        -----END RSA PRIVATE KEY-----`;

const samplePublicKey = `-----BEGIN PUBLIC KEY-----
        MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCqGKukO1De7zhZj6+H0qtjTkVxwTCpvKe4eCZ0\
        pIIVOFMDG+KESnAFV7l2c+cnzRMW0+b6f8mR1CJzZuxVLL6Q02fvLi55/mbSYxECQQDeAw6fiIQX\
        3j+skZ6UtW+5u09lHNsj6tQ51s1SPrCBkedbNf0Tp0GbMJDyR4e9
        -----END PUBLIC KEY-----`;

IdpForm = reduxForm({
  form: "createNewIdP",
  destroyOnUnmount: false,
  enableReinitialize: true
})(IdpForm);

const selector = formValueSelector("createNewIdP");

function mapStateToProps(state, ownProps) {
  const generateId = selector(state, "idp.generateID") ? true : false;
  const generateKeys = selector(state, "idp.sso.generate") ? true : false;

  let init;
  if (ownProps.idp) {
    init = ownProps.idp;
  } else {
    init = {
      contact: {
        contactType: contactTypes.tech
      },
      contacts: [
        {
          contactType: contactTypes.tech
        }
      ],
      idp: {
        generateID: "true",
        entityID: auto,
        "sso-certificates": auto,
        "aa-certificates": auto,
        sso: {
          generate: "true",
          public: auto,
          private: auto
        }
      }
    };
  }

  const initialValues = init;

  return {
    initialValues,
    generateId,
    generateKeys
  };
}

IdpForm.propTypes = {
  generateId: PropTypes.bool.isRequired,
  generateKeys: PropTypes.bool.isRequired,
  idp: PropTypes.string,
  progress: PropTypes.number
};

export default connect(mapStateToProps)(IdpForm);
