const navigate = async (path) => {
    $('#loadingbar').show();

    let resp = await sendRequest("auth/files/list" , "POST" , {
        path: path
    })

    $('#loadingbar').hide();

    if(resp.status == true){
        $('#files_and_folders').html(``);
        $('#current_dir').val(resp.currentPath);
        $('#exp_path').val(resp.currentPath);
        for(var file of resp.files) $('#files_and_folders').append(file_render(file))
    }else{
        message("Files" , resp.message);
    }
}

const re_navigate = (path) => {
    
    let joinPath = path;

    $('#current_dir').val(joinPath);

    navigate($('#current_dir').val())
}

const goBackFiles = () => {
    let joinBack = join($('#current_dir').val() , "..");

    $('#current_dir').val(joinBack);

    navigate($('#current_dir').val())
}

const file_render = (file_data = {
    "file_path": "/",
    "name": "",
    "size": "",
    "is_binary": false,
    "extname": "",
    "is_directory": true
}) => {
    
    return `<div class="col col-sm-3">
    <div class="card" style="width: 16rem;">
        <a ${file_data.is_directory ? `onclick="re_navigate('${file_data.file_path}')"` : ''}>
            <div class="card-img-top">
                <span class="material-symbols-outlined"
                    style="font-size: 54px; text-align: center; margin-left: auto; margin-right: auto; display: block;">
                    ${file_data.is_directory ? 'folder' : 'description'}
                </span>
            </div>
        </a>
        <div class="card-body">
            <hr />
            <p class="card-title"><b>${file_data.name}</b></p>
            <span>${file_data.size}</span>
            <hr/>
            <div class="dropdown">
                <button class="btn btn-info dropdown-toggle" type="button" data-bs-toggle="dropdown"
                    aria-expanded="false">
                    Options
                </button>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#">Action1</a></li>
                    <li><a class="dropdown-item" href="#">Another action</a></li>
                    <li><a class="dropdown-item" href="#">Delete</a></li>
                </ul>
            </div>
        </div>
    </div>
</div>`;
}