let $ = require("jquery");

if(localStorage.getItem("token")){
    open_page("dashboard");
}else{
    open_page("login")
}

function open_page(page){
    $.ajax({
        url: "routes/" + page + ".html",
        dataType: "html",
        success: function(response) {
            $('#body').html(response);
        }
    })
}
