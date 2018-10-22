const API_URL = "https://geantsrv15.ct1.garrservices.it";
const API_TOKEN = "access_token";

export async function callApi(
  endpoint,
  method = "POST",
  data,
  authenticated = true
) {
  let token = localStorage.getItem(API_TOKEN);
  let config = { headers: {} };

  if (authenticated) {
    if (!token) {
      //TODO: Redirect to login
      throw Error("No token saved!");
    }
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  switch (method) {
    case "POST":
      config.method = method;
      config.headers["Content-Type"] = "application/json";
      config.body = JSON.stringify(data);
      break;
    default:
      config.method = method;
      break;
  }

  try {
    let response = await fetch(API_URL + endpoint, config);
    let content = await response.json();

    if (!response.ok) throw new Error(content.message);

    return content;
  } catch (error) {
    console.error(error);
    return Promise.reject(error.message);
  }
}
