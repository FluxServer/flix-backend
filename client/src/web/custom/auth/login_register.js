let { ipcRenderer } = require("electron");

const function_perf_login = async () => {
    await ipcRenderer.send("url_init_host", $('#urlAddress').val())
    await localStorage.setItem("url" , $('#urlAddress').val());
    MAIN_URL = `http://${localStorage.getItem("url")}/`;

    let response = await request.post("login" , {
        "username" : $('#userName').val(),
        "password": $('#floatingPassword').val(),
    })

    console.log(response)
}