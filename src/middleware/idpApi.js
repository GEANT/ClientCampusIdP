const API_URL = "https://geantsrv15.ct1.garrservices.it"
const API_TOKEN = "access_token"

async function callApi(endpoint, data) {

    let token = localStorage.getItem(API_TOKEN)

    if (!token) {
        //TODO: Redirect to login
        throw Error("No token saved!")
    }

    let config = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
    }

    try {
        let response = await fetch(API_URL + endpoint, config)

        if(!response.ok)
            throw new Error(response.statusText)

        return await response.json()
    } catch (error) {
        return Promise.reject(error)
    }

    /*await fetch(API_URL + endpoint, config)
        .then(response => {
            if(response.ok)
                return response.json()
            throw new Error(response.statusText)
        })
        .then(content => console.log(content))
        .catch(error => Promise.reject(error)) error => console.log("Fetch operation failed", error.message))*/

    /*await axios.post(API_URL + endpoint, data, config)
        .then(response => {
            return Promise.resolve(response)
        }).catch(function (error) {
            return Promise.reject(error)
        })*/
}

export const CALL_API = Symbol('Call API')

export default store => next => action => {

    const callAPI = action[CALL_API]

    // apply middleware to "Call API" actions only
    if (typeof callAPI === 'undefined') {
        return next(action)
    }

    let { endpoint, types, data } = callAPI
    const [requestType, successType, errorType] = types

    store.dispatch({ type: requestType })

    return callApi(endpoint, data).then(
        response => next({
            response: response.message,
            type: successType
        }),
        error => next({
            error: error.message || "API request failed, unknown error",
            type: errorType
        })
    )
}