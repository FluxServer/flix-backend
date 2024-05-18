import { PrismaClient } from "@prisma/client";
import { Context } from "elysia";
import { adminAuth } from "../../utils/auth";
import { EventEmitter } from "node:events"
import { parse } from "../../utils/datarequest";
import { writeFileSync } from "node:fs";
import { join, extname } from "node:path";

export const run = async (context: Context, prisma: PrismaClient, eventEmitter: EventEmitter) => {
    let auth = await adminAuth(context, prisma);
    let body = await parse("fdata", context);

    if(auth !== null){
        let path = body.get("path");
        const file:Blob = body.get("file");
        
        await writeFileSync(join(path, file.name), Buffer.from(await file.arrayBuffer()))

        return {
            status: true,
            message: "File Uploaded Successfully",
            path: join(path, file.name)
        }
    }else{
        return {
            status: false,
            message: "Login Failed!"
        }
    }
}
