const navigate = async (path) => {
    $('#loadingbar').show();

    let resp = await sendRequest("auth/files/list", "POST", {
        path: path
    })

    $('#loadingbar').hide();

    if (resp.status == true) {
        $('#files_and_folders').html(``);
        $('#current_dir').val(resp.currentPath);
        $('#exp_path').val(resp.currentPath);
        for (var file of resp.files) $('#files_and_folders').append(file_render(file))
    } else {
        message("Files", resp.message);
    }
}

const re_navigate = (path) => {

    let joinPath = path;

    console.log(joinPath)

    $('#current_dir').val(joinPath);

    navigate($('#current_dir').val())
}

const goBackFiles = () => {
    let joinBack = join($('#current_dir').val(), "..");

    $('#current_dir').val(joinBack);

    navigate($('#current_dir').val())
}

const deleteFile = async (fileName) => {
    if (confirm("Are you sure you want to delete this file?")) {
        let resp = await sendRequest("auth/files/trash/move", "POST", {
            "path": $('#current_dir').val().replaceAll("\\", "\\\\"),
            "object": fileName
        })

        navigate($('#current_dir').val());

        if (resp.status == true) {
            message("Files", resp.message);

            navigate($('#current_dir').val());
        } else {
            message("Files", resp.message);
        }
    } else {

    }
}

const renameFile = async (fileName) => {
    let promt1 = prompt("New name for this file?");
    if (promt1 !== "") {
        let resp = await sendRequest("auth/files/rename", "POST", {
            "path": $('#current_dir').val().replaceAll("\\", "\\\\"),
            "file": fileName,
            "newName": promt1
        })

        if (resp.status == true) {
            message("Files", resp.message);

            navigate($('#current_dir').val());
        } else {
            message("Files", resp.message);
        }
    } else {

    }
}

const uploadFile = async () => {
    let file = document.getElementById("fileToUpload").files[0];

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Token ${localStorage.token}`);

    const formdata = new FormData();
    formdata.append("path", $('#current_dir').val());
    formdata.append("file", file, file.name);

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow"
    };

    let resp = await (await fetch(`${window.config.api_url}auth/files/upload`, requestOptions)).json();

    if(resp.status == true){
        navigate($('#current_dir').val());
        message("Files", resp.message);
    }else{
        message("Files", resp.message);
    }
}

const fileSave = async (path) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Token ${localStorage.token}`);
    myHeaders.append("Content-Type", "text/plain");

    var raw = `${path}\n${editor.getSession().getValue()}`

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    $('.overlay').show();

    let data = await (await fetch(`${config.api_url}auth/files/edit`, requestOptions)).json()

    if (data.status == true) {
        callRoute_Dashboard("/auth/files/explorer")
        $('.overlay').hide();
        message("Files", data.message);
    } else {
        $('.overlay').hide();
        message("Files", data.message);
    }

    callRoute_Dashboard("/auth/files/explorer");
}

const extractFile = async (path) => {
    callRoute_Dashboard("/auth/files/extract", async () => {
        $('#inputPath').val(path);
        $('#outputPath').val($('#current_dir').val());
    });
}

const extractProcess = async () => {
    $('#extractFile').attr('disabled' , "");

    let resp = await sendRequest("auth/files/7z/decompress" , "POST" , {
        "input" : $('#inputPath').val(),
        "output" : $('#outputPath').val(),
        "password" : "none"
    })

    if(resp.status == true){
        message("7z" , resp.message);
        callRoute_Dashboard("/auth/files/explorer")
        navigate($('#current_dir').val())
    }else{
        $('#extractFile').removeAttr('disabled');
        message("7z" , resp.message);
    }
}

const editFile = async (fname, path) => {
    let file = await sendRequest("auth/files/view?path=" + path.replaceAll("\\", "\\\\"), "GET", {}, false)
    let aceModeList = null;
    aceModeList = ace.require("ace/ext/modelist");

    callRoute_Dashboard("/auth/files/edit", async () => {
        var editor = ace.edit("ace_editor");
        let mode = aceModeList.getModeForPath(fname);

        $('#fileSave').attr("onclick", `fileSave('${path.replaceAll("\\", "\\\\")}');`)

        editor.setTheme("ace/theme/monokai");
        editor.getSession().setValue(file);
        editor.session.setMode(mode.mode);
        editor.renderer.updateFull();
        window.editor = editor;
        editor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true
        });
    })
}

const file_render = (file_data = {
    "file_path": "/",
    "name": "",
    "size": "",
    "is_binary": false,
    "extname": "",
    "is_directory": true
}) => {

    return `<div class="file-item">
    <div>
        <a ${file_data.is_directory ? `onclick="re_navigate('${file_data.file_path.replaceAll("\\", "\\\\")}')"` : ''}>
            <div class="card-img-top">
                <span class="material-symbols-outlined"
                    style="font-size: 30px; text-align: center; margin-left: auto; margin-right: auto; display: block;">
                    ${file_data.is_directory ? 'folder' : 'description'}
                </span>
            </div>
        </a>
        <div class="dropdown">
            <button style="padding:2px; background:transparent; border:none; border-radius:10px" class="dropdown-toggle" type="button" data-bs-toggle="dropdown"
                aria-expanded="false">
                    ...
            </button>
            <ul class="dropdown-menu">
                <li><a class="dropdown-item" onclick="renameFile('${file_data.name}')">Rename</a></li>
                ${file_data.is_directory ? `` : `<li><a class="dropdown-item" onclick="extractFile('${file_data.file_path.replaceAll("\\", "\\\\")}')">Extract (7z)</a></li>`}
                ${file_data.is_directory ? `` : `<li><a class="dropdown-item" onclick="editFile('${file_data.name}','${file_data.file_path.replaceAll("\\", "\\\\")}')">Edit</a></li>`}
                <li><a class="dropdown-item" onclick="deleteFile('${file_data.name}')">Delete</a></li>
            </ul>
        </div>
        <div class="card-body">
            <hr />
            <p class="card-title"><b>${file_data.name}</b></p>
            <span>${file_data.size}</span>
            <hr/>
        </div>
    </div>
</div>`;
}

