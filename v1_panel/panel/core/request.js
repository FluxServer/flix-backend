const sendRequest = async (endpoint = String, method = "GET", body = {}, json = true) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    if(localStorage.getItem("token")){
        headers.append("Authorization", `Token ${localStorage.token}`)
    }

    const raw = JSON.stringify(body);

    const requestOptions = method == "GET" ? {
        method: method,
        headers: headers,
        redirect: "follow"
    } : {
        method: method,
        headers: headers,
        body: raw,
        redirect: "follow"
    };

    let request = await fetch(`${config.api_url}${endpoint}`, requestOptions);

    if(json == true) return request.json();
    return request.text();
}