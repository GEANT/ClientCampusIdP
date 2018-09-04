import React from "react";
import { Form, Grid } from "react-bootstrap";
import { Field, reduxForm } from "redux-form";
import { passwords } from "../utils/passwords";
import FormButtons from "./FormButtons";
import renderField from "./renderField";

//Field validators
const required = value => (value ? undefined : "Required");
const email = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? "Invalid email address"
    : undefined;
const passwordsMatch = (value, allValues) =>
  value && value !== allValues.password ? "Passwords do not match" : undefined;
const minLength = min => value =>
  value && value.length < min
    ? `A minimum length of ${min} characters is required`
    : undefined;
const minLength8 = minLength(8);
const password = (value, allValues) => {
  //passwords.push(allValues.username);

  for (let password of passwords) {
    if (value.includes(password)) {
      return `The password must not contain "${password}"`;
    }
  }
  return undefined;
};

let RegistrationForm = props => {
  const { handleSubmit, ...rest } = props;

  return (
    <Form horizontal onSubmit={handleSubmit}>
      <Grid>
        <Field
          name="username"
          type="text"
          placeholder="jondoe"
          label="User"
          glyph="user"
          component={renderField}
          validate={[required]}
        />
        <Field
          name="email"
          type="email"
          placeholder="jon.doe@university.org"
          label="Email"
          glyph="envelope"
          component={renderField}
          validate={[required, email]}
        />
        <Field
          name="password"
          type="password"
          placeholder="password"
          label="Password"
          glyph="eye-close"
          tipp="Password must not contain the username, sequential numbers or common passwords"
          component={renderField}
          validate={[required, password, minLength8]}
        />
        <Field
          name="password2"
          type="password"
          placeholder="password"
          label="Retype password"
          glyph="eye-close"
          component={renderField}
          validate={[required, passwordsMatch]}
        />
        <FormButtons {...rest} />
      </Grid>
    </Form>
  );
};

export default (RegistrationForm = reduxForm({
  form: "createUser"
})(RegistrationForm));
