import { PrismaClient } from "@prisma/client";
import { Context } from "elysia";
import { adminAuth } from "../../utils/auth";
import { parse } from "../../utils/datarequest";
import { EventEmitter } from "node:events"
import { f_rs_create_ssl } from "../../features/flix_rs_pass";

export const run = async (context: Context,prisma: PrismaClient, eventEmitter: EventEmitter) => {
    let auth = await adminAuth(context, prisma);
    let body = await parse("auto", context);

    if(auth !== null){
        let new_ssl_crt:boolean = await f_rs_create_ssl(eventEmitter, prisma, body.get("site_id") , body.get("domain"), process.env['EMAIL'] as string)

        if(new_ssl_crt == true){
            eventEmitter.emit("init-re-init-site" , body.get("site_id"))

            return {
                status: true,
                message: "Certificate Generated Successfully"
            }
        }else{
            return {
                status: false,
                message: "Failed to Generate Certificate"
            }
        }
    }else{
        return {
            status: false,
            message: "Login Failed!"
        }
    }
}