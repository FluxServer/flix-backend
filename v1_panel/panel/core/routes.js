if (localStorage.getItem("token")) {
    window.location.href = "#/auth/dashboard";
} else {
    window.location.href = "#/login";
}

const routeThatRequireLoginAccess = [
    "/auth/dashboard"
]

document.addEventListener('DOMContentLoaded', () => {
    const contentDiv = document.getElementById('content');

    // Function to render the content based on the current route
    function renderRoute() {
        const hash = window.location.hash || '#/';
        let route = hash.substring(1) || 'home'; // Remove the '#' character and default to 'home'
        let routePath = `/v1_panel/routes${route === '/' ? '/auth/dashboard' : route}.html`;

        $('.overlay').show();

        if (routeThatRequireLoginAccess.includes(route)) {
            if (!localStorage.getItem("token")) {
                route = "login";
                routePath = `/v1_panel/routes/login.html`;
            }
        }

        fetch(routePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                window.location.href = "#" + route;
                $('.overlay').hide();
                return response.text();
            })
            .then(html => {
                contentDiv.innerHTML = html;
                functionCall(route);
            })
            .catch(error => {
                contentDiv.innerHTML = '<h1>404</h1><p>Page not found</p>';
                console.error('There was a problem with the fetch operation:', error);
            });
    }

    // Event listener for hash change
    window.addEventListener('hashchange', renderRoute);

    // Initial render
    renderRoute();
});


function callRoute_Dashboard(route) {
    let routePath = `/v1_panel/routes/dashboard${route === '/' ? '/auth/dashboard' : route}.html`;
    const dash_content = document.getElementById('dash_content');

    fetch(routePath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }   
            $('.overlay').hide();
            roundfunctionCall(route);
            return response.text();
        })
        .then(html => {
            dash_content.innerHTML = html;
        })
        .catch(error => {
            dash_content.innerHTML = '<h1>404</h1><p>Page not found</p>';
            console.error('There was a problem with the fetch operation:', error);
        });
}

function functionCall(route) {
    if (route == "/auth/dashboard") {
        findSysInfo();
        start_logs();
        callRoute_Dashboard("/auth/dashboard")
    }
}


function roundfunctionCall(route) {
    if (route == "/auth/dashboard") {
        findSysInfo();
    }

    if(route == "/auth/sites/list") {
        fetchList();
    }

    if(route == "/auth/apps/list") {
        fetchExcAppsList();
    }

    if(route == "/auth/files/explorer") {
        navigate($('#current_dir').val())
    }
}