const API_URL = "https://geantsrv15.ct1.garrservices.it";
const API_TOKEN = "access_token";

export async function callApi(
  endpoint,
  data,
  authenticated = true,
  method = "POST"
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

  if (method === "POST") {
    config.method = method;
    config.headers["Content-Type"] = "application/json";
    config.body = JSON.stringify(data);
  } else if (method === "DELETE") {
    config.method = method;
  } else if (method === "GET") {
    config.method = method;
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
