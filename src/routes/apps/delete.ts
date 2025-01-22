import { PrismaClient } from "@prisma/client";
import { Context } from "elysia";
import { adminAuth } from "../../utils/auth";
import { EventEmitter } from "node:events"
import { parse } from "../../utils/datarequest";

export const run = async (context: Context,prisma: PrismaClient,eventEmitter: EventEmitter) => {
    let auth = await adminAuth(context, prisma);
    let body = await parse("auto", context);

    if(auth !== null){
        eventEmitter.emit(`stop-process` , body.get('id'));
        eventEmitter.emit(`list-running-process`);

        await prisma.application.delete({
            where: {
                application_id: parseInt(body.get("id"))
            }
        })

        return {
            status: true,
            message: "Requested Process Manager to Stop Process & Delete the Application"
        }
    }else{
        return {
            status: false,
            message: "Login Failed!"
        }
    }
}