import { PrismaClient } from "@prisma/client";
import { Context } from "elysia";
import { adminAuth } from "../../utils/auth";
import { EventEmitter } from "node:events"
import { parse } from "../../utils/datarequest";

export const run = async (context: Context, prisma: PrismaClient, eventEmitter: EventEmitter) => {
    let auth = await adminAuth(context, prisma);
    let body = await parse("auto" , context);

    if(auth !== null){
        let site = await prisma.site.findFirst({
            where: {
                site_id: body.get("site_id")
            }
        });

        if(auth.user_type !== 0){
            if(site?.site_owned_by !== auth.id) return {
                status: false,
                message: "403: Unauthorized"
            }
        }

        await prisma.site.update({
            where: {
                site_id: site?.site_id
            },
            data: {
                site_config: body.get("config")
            }
        })

        await eventEmitter.emit('reload', site?.site_id);

        return {
            status: true,
            message: "Site Config Updated Successfully"
        }
    }else{
        return {
            status: false,
            message: "Login Failed!"
        }
    }
}
