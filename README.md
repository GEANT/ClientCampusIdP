# ClientCampusIdP

This software provides a React based GUI for the Campus IdP API.

## Requirements

Node package manager: [npm](https://www.npmjs.com/)

## Usage

### Configure end point

Configure API end point overriding `.env` file with your API server address. Read more about [Adding Custom Environment Variables](https://facebook.github.io/create-react-app/docs/adding-custom-environment-variables) in the official React page.

### Install dependencies

```sh
npm install
```

### Run locally

```sh
npm start
```

## Deployment

Prepare production package
```sh
npm run-script build
```
Copy the content of the "build" directory into the served directory of your web server.
