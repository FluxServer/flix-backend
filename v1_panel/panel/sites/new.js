const newSite = async () => {
    show();

    let resp = await sendRequest("auth/sites/new" , "POST", {
        "domain" : $('#domain_name').val(),
        "enable_php" : $('#enable_php').prop('checked') ? "on" : "off",
        "php" : "8.3",
        "app_link" : $('#app_list_site').val(),
        "port": $('#proxy_port').val()
    })

    if(resp.status == true){
        message("Sites" , resp.message);

        $('#domain_name').val('');
        $('#app_list_site').val("none");
        $('#proxy_port').val('')

        $('.overlay').hide();

        fetchList();
    }else{
        $('.overlay').hide();

        message("Sites" , resp.message);
    }
}