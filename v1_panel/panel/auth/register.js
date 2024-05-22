const register_login = async () => {
    $('.overlay').show();

    let data = await sendRequest("register" , "POST" , {
        "username" : $('#r_username').val(),
        "displayName" : $('#r_displayName').val(),
        "password": $('#r_password').val()
    });

    if(data.status == true){
        message("Registeration" , data.message)

        localStorage.setItem("token" , data.token);

        window.location.href = "#/dashboard";
    }else{
        message("Registeration Issue" , data.message)
    }
};