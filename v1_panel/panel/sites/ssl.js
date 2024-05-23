const applySSL = async (domain, id) => {
    $('#sitesslbtn_' + id).attr('disabled' , 1)
    $('#sitesslbtn_' + id).addClass('disabled')

    let resp = await sendRequest("auth/sites/ssl-new" , "POST", {
        "domain" : domain,
        "site_id" : id
    })

    if(resp.status == true){
        message("Sites" , resp.message);
        $('#sitesslbtn_' + id).removeAttr('disabled')
        $('#sitesslbtn_' + id).removeClass('disabled')

        fetchList();
    }else{
        $('#sitesslbtn_' + id).removeAttr('disabled')
        $('#sitesslbtn_' + id).removeClass('disabled')
        message("Sites" , resp.message);
    }
}