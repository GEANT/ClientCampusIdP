const AUTH_URL = process.env.REACT_APP_API_URL;
const AUTH_ENDPOINT = "/authenticate";

export async function requestToken(username, password) {

    let config = {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "name=" + username + "&password=" + password
    }

    try {
        let response = await fetch(AUTH_URL + AUTH_ENDPOINT, config)
        let content = await response.json()

        if (!response.ok)
            throw new Error(content.message)

        //Check if the response contains a token 
        if (!content.success || !content.token)
            throw new Error("The response does not contain an access token")

        return content.token
    } catch (error) {
        console.error(error)
        return Promise.reject(error.message)
    }
}