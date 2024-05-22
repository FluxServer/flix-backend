function start_logs() {
    const ws = new WebSocket(config.ws_url)

    ws.addEventListener("open", (event) => {
        console.log("WebSocket Connection Successfull!")
        
        ws.send(JSON.stringify({
            event: "login",
            token: localStorage.token
        }))
    });

    ws.onmessage = (message) => {
        let data = JSON.parse(message.data);

        $('#wss_logs').append(
            `<b>${new Date().toDateString()}</b> : <div style="background:black; padding:12px;">${data.data}</div> <hr/>`
        );
    }
}