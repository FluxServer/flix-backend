let MAIN_URL = `http://${localStorage.getItem("url")}/`;

const request = {
    get: async (route) => {
        try {
            let data = await fetch(`${MAIN_URL}v1/${route}`, {
                method: "GET",
                redirect: "follow"
            })

            return await data.json();
        } catch (e) {
            consoleModal.show()
            $('#console_body').append(`<p style="color:white;">Unable to make request to ${route}</p>`);
        }
    },

    post: async (route, raw_or_formdata) => {
        try {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");

            let data = await fetch(`${MAIN_URL}v1/${route}`, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(raw_or_formdata),
                redirect: "follow"
            })

            return await data.json();
        } catch (e) {
            consoleModal.show()
            $('#console_body').append(`<p style="color:white;">Unable to make request to ${route}</p>`);
        }
    },

    auth_post: async (route, raw_or_formdata) => {
        try {
            if (localStorage.getItem('token') == null) {
                return { status: false, message: "login failed" };
            }

            const headers = new Headers();
            headers.append("Authorization", `Token ${localStorage.getItem('token')}`);
            headers.append("Content-Type", "application/json");

            let data = await fetch(`${MAIN_URL}v1/${route}`, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(raw_or_formdata),
                redirect: "follow"
            })

            return await data.json();
        } catch (e) {
            consoleModal.show()
            $('#console_body').append(`<p style="color:white;">Unable to make request to ${route}</p>`);
        }
    }
}