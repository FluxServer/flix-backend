const request_check_users = async () => {
    $('.overlay').show();

    let data = await sendRequest("_uscnt", "GET" , {});

    if(data.status == true){
        if(data.count == 0) window.location.href = "#/register";
        $('.overlay').hide();
    }
}

request_check_users();  