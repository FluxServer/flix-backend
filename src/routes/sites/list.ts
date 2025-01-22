import { PrismaClient } from "@prisma/client";
import { Context } from "elysia";
import { adminAuth } from "../../utils/auth";
import { EventEmitter } from "node:events"
import { f_rs_sslexpirydate } from "../../features/flix_rs_pass";

export const run = async (context: Context, prisma: PrismaClient, eventEmitter: EventEmitter) => {
    let auth = await adminAuth(context, prisma);

    if(auth !== null){
        let sites = auth.user_type == 0 ? await prisma.site.findMany() : await prisma.site.findMany({
            where: {
                site_owned_by: auth.id
            }
        });
        let _sites = await Promise.all(sites.map(async data => {
            let certificate = await f_rs_sslexpirydate(eventEmitter, data.site_domain_1);
            return {
                ...data,
                certificate
            };
        }));

        return {
            status: true,
            message: "Sites Fetched Successfully",
            data: _sites
        }
    }else{
        return {
            status: false,
            message: "Login Failed!"
        }
    }
}
