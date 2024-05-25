const login_user = async () => {
    $('.overlay').show();

    let data = await sendRequest("login" , "POST" , {
        "username" : $('#u_username').val(),
        "password": $('#u_password').val()
    });

    if(data.status == true){
        message("Login" , data.message)

        localStorage.setItem("token" , data.token);

        $('.overlay').hide();

        window.location.href = "#/auth/dashboard";
    }else{
        $('.overlay').hide();
        message("Login" , data.message)
    }
};