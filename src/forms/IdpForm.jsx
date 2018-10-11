import PropTypes from "prop-types";
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
  Row
} from "react-bootstrap";
import { connect } from "react-redux";
import { Field, FieldArray, formValueSelector, reduxForm } from "redux-form";
import { TIMEZONES } from "../utils/timezones";
import Checkbox from "./Checkbox";
import FormButtons from "./FormButtons";
import renderField from "./renderField";
import FileInput from "./FileInput";

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
const host = value =>
  value &&
  !/^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$/i.test(
    value
  )
    ? "Invalid hostname (RFC 1123)"
    : undefined;
const mdp = value =>
  value &&
  !/^https:\/\/(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9]).*\.xml$/i.test(
    value
  )
    ? "Invalid metadata provider URL"
    : undefined;
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
    generateTLS,
    ...rest
  } = props;

  //const renderImage = logoFile ? URL.createObjectURL(logoFile) : null;

  const toggleEntityID = (event, value) => {
    if (value) {
      change("idp.entityID", auto);
    } else {
      change("idp.entityID", "");
    }
  };

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
              validate={[required, mdp]}
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

  const renderScopes = ({ fields, meta: { touched, error, submitFailed } }) => (
    <React.Fragment>
      {fields.map((scope, index) => (
        <Field
          name={`${scope}.scope`}
          key={index}
          type="text"
          placeholder="example.org"
          label="Scope"
          glyph="tag"
          component={renderField}
          validate={[required, host]}
          /* uncomment to allow multiple scopes
          button={
            <Button
              title="Add"
              onClick={() => (index ? fields.remove(index) : fields.push())}
            >
              <Glyphicon glyph={index ? "trash" : "plus"} />
            </Button>
          }*/
        />
      ))}
    </React.Fragment>
  );

  //Read time zones from utils/timezones
  const timezones = Object.keys(TIMEZONES).map((value, index) => (
    <option key={index} value={TIMEZONES[value]}>
      {value}
    </option>
  ));

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
                name="organization.name"
                type="text"
                placeholder="University of Europe"
                label="Organization"
                glyph="home"
                component={renderField}
              />
              <Field
                name="organization.url"
                type="text"
                placeholder="university.edu"
                label="Website"
                glyph="globe"
                component={renderField}
                validate={[required, domain]}
              />
              <Row>
                <Col md={2}>
                  <b>Options</b>
                </Col>
                <Col md={2}>
                  <Field
                    name="organization.coco"
                    type="checkbox"
                    label="Support CoCo"
                    component="input"
                  />
                  &ensp;Support CoCo
                </Col>
                <Col md={2}>
                  <Field
                    name="organization.entityCategories"
                    type="checkbox"
                    label="R&S Entity Categories"
                    component="input"
                  />
                  &ensp;R&S Entity Categories
                </Col>
              </Row>
              <br />
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
                label="FQDN"
                onChange={(event, value) =>
                  generateId
                    ? null
                    : change("idp.entityID", `https://${value}/`)
                }
                glyph="globe"
                component={renderField}
                validate={[required, host]}
              />
              <Field
                name="idp.entityID"
                type="custom"
                placeholder="https://idp.example.org/idp"
                label="Entity ID"
                addon="@"
                checkbox={
                  <Field
                    name="idp.generateID"
                    type="checkbox"
                    label="Generate Entity ID"
                    onChange={toggleEntityID}
                    component="input"
                  />
                }
                readOnly={generateId}
                component={renderField}
                normalize={updateEntityID}
                validate={[required, validEntitiyID]}
              />
              <FieldArray name="scopes" component={renderScopes} />
              <Field
                name="language"
                componentClass="select"
                label="Language"
                glyph="globe"
                component={renderField}
                validate={required}
              >
                <option value={contactTypes.admin}>English</option>
              </Field>
              <Field
                name="timezone"
                componentClass="select"
                label="Time zone"
                glyph="time"
                component={renderField}
                validate={required}
              >
                {timezones}
              </Field>
              <Field
                name="logo"
                type="text"
                placeholder="www.example.org/logo.png"
                label="Logo"
                glyph="picture"
                tipp="Enter a valid URL or upload an image from local file system. Logo must have 80x60 pixels"
                component={renderField}
                validate={required}
                onChange={() => change("logoUpload", "")}
                checkbox={
                  <Field
                    name="logoUpload"
                    accept="image/*"
                    onChange={(event, value) => {
                      change("logo", value.name);
                    }}
                    component={FileInput}
                  />
                }
              />
              <Field
                name="favicon"
                type="text"
                placeholder="www.example.org/favicon.png"
                label="Favicon"
                glyph="picture"
                tipp="Enter a valid URL or upload an image from local file system. Favicon must have 16x16 pixels"
                component={renderField}
                validate={required}
                onChange={() => change("faviconUpload", "")}
                checkbox={
                  <Field
                    name="faviconUpload"
                    accept="image/*"
                    onChange={(event, value) => change("favicon", value.name)}
                    component={FileInput}
                  />
                }
              />
              <Checkbox
                name="idp.sso.generate"
                label="Custom SSO"
                tipp="SSO keys may be generated server-side, otherwise they must be provided"
              />
              {generateKeys && (
                <React.Fragment>
                  <Field
                    name="idp.sso.public"
                    type="textarea"
                    placeholder={samplePublicKey}
                    label="SSO Public key"
                    glyph="eye-open"
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
                    componentClass="textarea"
                    rows="7"
                    component={renderField}
                    validate={required}
                  />
                </React.Fragment>
              )}
              {idp && (
                <Checkbox
                  name="idp.web.tls.generate"
                  label="Custom TLS"
                  tipp="A TLS is initially created by server-side, but may be replaced by a custom one"
                />
              )}
              {generateTLS && (
                <React.Fragment>
                  <Field
                    name="idp.web.tls.cert"
                    type="textarea"
                    placeholder="certificate"
                    label="Certificate"
                    glyph="eye-open"
                    componentClass="textarea"
                    rows="7"
                    component={renderField}
                    validate={required}
                  />
                  <Field
                    name="idp.web.tls.key"
                    type="textarea"
                    placeholder={samplePrivateKey}
                    label="Private key"
                    glyph="eye-close"
                    componentClass="textarea"
                    rows="7"
                    component={renderField}
                    validate={required}
                  />
                </React.Fragment>
              )}
            </Panel.Body>
          </Panel>
          <FieldArray name="metadataProviders" component={renderMetadata} />
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
pIIVOFMDG+KESnAFV7l2c+cnzRMW0+b6f8mR1CJzZuxVLL6Q02fvLi55/mbSYxECQQDeAw6fiIQXAkEAxCL5HQb2bQr4ByorcMWm/hEP2MZzROV73yF41hPsRC9m66KrheO9HPTJuo3/9s5p+sqGxOlF37sJ5QsW+sJyoNde3xH8vdXhzU7eT82D6X/scw9RZz+/6rCJ4p0=
-----END RSA PRIVATE KEY-----`;

const samplePublicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCqGKukO1De7zhZj6+H0qtjTkVxwTCpvKe4eCZ0pIIVOFMDG+KESnAFV7l2c+cnzRMW0+b6f8mR1CJzZuxVLL6Q02fvLi55/mbSYxECQQDeAw6fiIQX3j+skZ6UtW+5u09lHNsj6tQ51s1SPrCBkedbNf0Tp0GbMJDyR4e9
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
  const generateTLS = selector(state, "idp.web.tls.generate") ? true : false;

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
      scopes: [{ scope: "" }],
      idp: {
        generateID: true,
        entityID: auto,
        sso: {
          generate: false
        }
      },
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: "English"
    };
  }

  const initialValues = init;

  return {
    initialValues,
    generateId,
    generateKeys,
    generateTLS
  };
}

IdpForm.propTypes = {
  generateId: PropTypes.bool.isRequired,
  generateKeys: PropTypes.bool.isRequired,
  idp: PropTypes.string,
  progress: PropTypes.number
};

export default connect(mapStateToProps)(IdpForm);
