const fetchExcAppsList = async () => {
    $('#siteLoads').show();
    let res = await sendRequest("auth/app/list");
    $('#siteLoads').hide();
    $('#exec_app_list').html('');
    $('#app_list_site').html(` <option value="none">None (No Link)</option>`);

    for (app of res.data) {
        if($('#app_list_site').length !== 0){
            $('#app_list_site').append(`<option value="${app.application_id}">${app.application_name}</option>`);
        }
        $('#exec_app_list').append(
            `<tr>
                <td>${app.application_id}</td>
                <td>${app.application_name}</td>
                <td>${app.application_enabled ? 'Enabled' : 'Disabled'}</td>
                <td>${app.application_running ? '<span style="padding:2px; border:2px solid green; background:green; color:white;">Running</span>' : `<span style="padding:2px; border:2px solid red; background:red; color:white;">Stopped</span>`}</td>
                <td>
                    ${app.application_running ? `<button class="btn btn-danger" onclick="doAppAction('stop' , ${app.application_id})">Stop</button>` : `<button class="btn btn-success" onclick="doAppAction('start' , ${app.application_id})">Start</button>`}
                </td>
            </tr>`
        )
    }
}

const doAppAction = async (action, id) => {
    let res = await sendRequest("auth/app/" + action , "POST" , {
        id: id
    });

    if(res.status == true){
        message("Applications" , res.message)
        fetchExcAppsList();
    }else{
        message("Applications" , res.message)
    }
}

const addApp = async () => {
    
}