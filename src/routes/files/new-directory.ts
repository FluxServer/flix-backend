import { PrismaClient } from "@prisma/client";
import { Context } from "elysia";
import { adminAuth } from "../../utils/auth";
import { EventEmitter } from "node:events"
import { parse } from "../../utils/datarequest";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

export const run = async (context: Context, prisma: PrismaClient) => {
    let auth = await adminAuth(context, prisma);
    let body = await parse("auto", context);

    if(auth !== null){
        let path = body.get("path");
        const folder = body.get("folder");

        await mkdirSync(join(path, folder), {recursive: true});

        return {
            status: false,
            message: "New Folder Created Successfully"
        }
    }else{
        return {
            status: false,
            message: "Login Failed!"
        }
    }
}
