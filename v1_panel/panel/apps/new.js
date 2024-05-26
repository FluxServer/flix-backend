const addApp = async () => {
    show();

    let resp = await sendRequest("auth/app/new" , "POST", {
        "name" : $('#appName').val(),
        "startup" : $('#auto_startup').prop('checked') ? "on" : "off",
        "directory" : $('#appDirectory').val(),
        "command" : $('#appCommand').val()
    })

    if(resp.status == true){
        message("Sites" , resp.message);

        $('#appName').val('');
        $('#appDirectory').val('')
        $('#appCommand').val('')

        $('.overlay').hide();

        fetchExcAppsList();
    }else{
        $('.overlay').hide();

        message("Sites" , resp.message);
    }
}