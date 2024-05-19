import { Application, PrismaClient } from "@prisma/client";
import { Context } from "elysia";
import { adminAuth } from "../../utils/auth";
import { parse } from "../../utils/datarequest";
import { EventEmitter } from "node:events"

export const run = async (context: Context,prisma: PrismaClient, eventEmitter: EventEmitter) => {
    let auth = await adminAuth(context, prisma);
    let body = await parse("auto", context);

    if(auth !== null){
        let appLink:Application;
        if(body.get("app_link") !== "none"){
            let application = await prisma.application.findFirst({
                where: {
                    application_id: body.get("app_link")
                }
            })

            appLink = application!;
        }

        let site = await prisma.site.create({
            data: {
                site_domain_1: body.get("domain"),
                site_domain_2: "not",
                site_directory: "",
                site_ssl_crt_file: "",
                site_ssl_key_file: "",
                site_application_link: 0,
                site_php_enabled: body.get("enable_php") == "on" ? true : false,
                site_ssl_enabled: false,
                site_owned_by: auth.id,
                site_php_version: body.get("php"),
                site_proxy_enabled: body.get("app_link") == "none" ? false : true,
                site_proxy_port: parseInt(body.get("port")) || 0
            }
        })

        eventEmitter.emit("init-re-init-site" , site.site_id)

        return {
            status: true,
            message: "New Site Created Successfully",
            data: site
        }
        
    }else{
        return {
            status: false,
            message: "Login Failed!"
        }
    }
}