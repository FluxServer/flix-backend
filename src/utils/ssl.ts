import { join } from "node:path";
import * as CSR from "@root/csr";
import * as PEM from "@root/pem";
import * as acmeWebroot from "acme-http-01-webroot";

export const create_ssl_v1 = async (domain: string) => {
    var http01 = acmeWebroot.create({
        webroot: `/var/npnl/sites/${domain}/public_html/.well-known/acme-challenge`
    });
}