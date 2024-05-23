const fetchList = async () => {
    $('#siteLoads').show();
    let res = await sendRequest("auth/sites/list");
    $('#siteLoads').hide();
    show();

    for (site of res.data) {
        $('.overlay').hide();

        $('#sites_list').append(
            `<div class="card" style="width: 19rem; margin-left:12px;">
                <div class="card-body">
                <h5 class="card-title">${site.site_domain_1}</h5>
                <h6 class="card-subtitle mb-2 text-body-secondary">${site.site_ssl_enabled ? `Secure` : `Not-Secure`}</h6>
                <p class="card-text">
                    ${site.site_ssl_enabled ? `Expired : ${site.certificate.expired ? 'Yes' : 'No'} <br/> Days Left : ${site.certificate.daysLeft}` : ``}
                </p>
                ${site.site_ssl_enabled ?
                site.certificate.expired ? `<button onclick="applySSL('${site.site_domain_1}', ${site.site_id})" id="sitesslbtn_${site.site_id}" class="btn btn-primary">Apply SSL</button>` : ''
                : `<button onclick="applySSL('${site.site_domain_1}', ${site.site_id})" id="sitesslbtn_${site.site_id}" class="btn btn-primary">Apply SSL</button>`
            }
                <button class="btn btn-danger" onclick="deleteSite('${site.site_id}')" id="delsitebtn_${site.site_id}">Delete</button>
                </div>
            </div>`
        );
    }
}

const deleteSite = async (site_id) => {
    if (confirm("Are you sure?")) {
        let resp = await sendRequest("auth/sites/delete", "POST", {
            "site_id": site_id
        })

        fetchList();

        message("Sites", resp.message);
    }
} 