const fetchList = async () => {
    try {
        $('#siteLoads').show();
        let res = await sendRequest("auth/sites/list");
        $('#siteLoads').hide();
        show();
        $('.overlay').hide();

        let sitesHtml = '';
        for (let site of res.data) {
            const sslInfo = site.site_ssl_enabled ?
                `Expired: ${site.certificate.expired ? 'Yes' : 'No'} <br/> Days Left: ${site.certificate.daysLeft}` : '';
            const sslButton = !site.site_ssl_enabled || site.certificate.expired ?
                `<button onclick="applySSL('${site.site_domain_1}', ${site.site_id})" id="sitesslbtn_${site.site_id}" class="btn btn-primary">Apply SSL</button>` : '';

            sitesHtml += `
                <div class="card" style="width: 19rem; margin-left:12px;">
                    <div class="card-img-top" style="padding:50px;">
                        <span class="material-symbols-outlined">
                        language
                        </span>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${site.site_domain_1}</h5>
                        <h6 class="card-subtitle mb-2 text-body-secondary">${site.site_ssl_enabled ? 'Secure' : 'Not-Secure'}</h6>
                        <p class="card-text">${sslInfo}</p>
                        <hr/>
                        ${sslButton}
                        <hr/>
                        <button class="btn btn-secondary" onclick="openFile('${site.site_directory}')">Files</button>
                        <button class="btn btn-danger" onclick="deleteSite('${site.site_id}')" id="delsitebtn_${site.site_id}">Delete</button>
                    </div>
                </div>`;
        }

        $('#sites_list').html(sitesHtml);
    } catch (error) {
        console.error("Error fetching sites list:", error);
        $('#siteLoads').hide();
        show();
        $('.overlay').hide();
        message("Error", "Failed to load sites list. Please try again later.");
    }
}

const openFile = async (path) => {
    try {
        $('#current_dir').val(path);
        await callRoute_Dashboard("/auth/files/explorer");
    } catch (error) {
        console.error("Error opening file:", error);
        message("Error", "Failed to open file. Please try again.");
    }
}

const deleteSite = async (site_id) => {
    if (confirm("Are you sure?")) {
        try {
            let resp = await sendRequest("auth/sites/delete", "POST", { "site_id": parseInt(site_id) });
            await fetchList();
            message("Sites", resp.message);
        } catch (error) {
            console.error("Error deleting site:", error);
            message("Error", "Failed to delete site. Please try again.");
        }
    }
}
