window.config = {
    api_url: `${location.protocol}//${location.host}/v1/`,
    ws_url: `${location.protocol == "http:" ? "ws:" : "wss:"}//${location.host}/wssocket`
}

const toastElList = document.querySelectorAll('.toast')
const toast = [...toastElList].map(toastEl => new bootstrap.Toast(toastEl, {}))[0];

function show() {
    $('.overlay').show();
}

function hide() {
    $('.overlay').show();
}

function message(title, content) {
    $('#t_title').html(title);
    $('#t_body').html(content);

    toast.show();
}