async function findSysInfo() {
    setTimeout(() => $('.overlay').show(), 100);

    let sysinfo = await sendRequest("auth/sysinfo", "GET", {})

    $('.overlay').hide();

    $('#user_name').html(sysinfo.user_info.displayName);

    if ($('#ram_usage').length !== 0) {
        $('#ram_usage').html(`${sysinfo.memory.used} / ${sysinfo.memory.total} (Free : ${sysinfo.memory.free})`);
    }

    if ($('#swap_info').length !== 0) {
        $('#swap_info').html(`${sysinfo.memory.swap.used} / ${sysinfo.memory.swap.total} (Free : ${sysinfo.memory.swap.free})`);
    }

    if ($('#storage_info').length !== 0) {
        $('#storage_info').html(`${sysinfo.storage.devices[0].used} / ${sysinfo.storage.devices[0].total} at <b>${sysinfo.storage.devices[0].mountPoint}</b>`);
    }

    if ($('#c_temp').length !== 0) {
        $('#c_temp').html('');
        for (var inf of sysinfo.components) {
            $('#c_temp').append(` 
                <div class="card" style="width: 21rem;">
                    <div class="card-body">
                    <h5 class="card-title">${inf.name}</h5>
                    <h6 class="card-subtitle mb-2 text-body-secondary">Current Temp : ${inf.temperature}°</h6>
                    <p>Critical Temp : ${inf.criticalTemperature}°</p>
                    </div>
                </div>
            `)
        }
    }

    if ($('#n_interfaces').length !== 0) {
        $('#n_interfaces').html("");

        for (var inf in sysinfo.network.interfaces) {
            let infInfo = sysinfo.network.interfaces[inf];

            $('#n_interfaces').append(
                `<div class="card" style="width: 21rem;">
                    <div class="card-body">
                    <h5 class="card-title">${inf}</h5>
                    <h6 class="card-subtitle mb-2 text-body-secondary">${infInfo.length} IPs</h6>
                        ${returnIPList(infInfo)}
                    </div>
                </div>`
            );
        }

        function returnIPList(data) {
            var iplist = "";
            for (var ip of data) {
                iplist = iplist + `<b>${ip.address} (${ip.family})</b> <hr/>`
            }

            return iplist;
        }
    }
}