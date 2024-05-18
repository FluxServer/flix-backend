import { PrismaClient } from "@prisma/client";
import { Context } from "elysia";
import { adminAuth } from "../../utils/auth";
import { EventEmitter } from "node:events"
import { parse } from "../../utils/datarequest";
import { existsSync } from "node:fs";

export const run = async (context: Context,prisma: PrismaClient,eventEmitter: EventEmitter) => {
    let auth = await adminAuth(context, prisma);
    let body = await parse("auto" , context);

    // Check if directory exists and don't allow /
    if(body.get("directory") == "/" || body.get("directory") == "/root" || body.get("directory") == "/dev") return {
        status: false,
        message: "/ and /root and /dev is not allowed to be in application list"
    }

    if((await existsSync(body.get("directory"))) == true){
        let application = await prisma.application.create({
            data: {
                application_run_dir: body.get("directory"),
                application_enabled: body.get("startup") == "on" ? true : false,
                application_name: body.get("name"),
                application_runtime: body.get("command")
            }
        })

        eventEmitter.emit("new-process", application.application_id);

        return {
            status: true,
            message: `Application created successfully ${body.get("startup") == "on" ? "and Is Running too!" : ""}!`,
            data: application
        }
    }else{
        return {
            status: false,
            message: "The Directory You Provided does not exists at all"
        }
    }
}