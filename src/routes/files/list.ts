import { PrismaClient } from "@prisma/client";
import { Context } from "elysia";
import { adminAuth } from "../../utils/auth";
import { EventEmitter } from "node:events"
import { parse } from "../../utils/datarequest";
import { readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

export const run = async (context: Context, prisma: PrismaClient, eventEmitter: EventEmitter) => {
    let auth = await adminAuth(context, prisma);
    let body = await parse("auto", context);

    if(auth !== null){
        let _files = readdirSync(body.get("path"));
        var files:Array<{file_path: string,name: string,is_binary: Boolean,extname: String,is_directory: Boolean}> = [];

        _files.forEach(async file => {
            let path = join(body.get("path"), file);
            let stat = await statSync(path);
            files.push({
                file_path: path,
                name: file,
                is_binary: stat.isFile(),
                extname: extname(file),
                is_directory: stat.isDirectory()
            });
        });

        return {
            status: true,
            message: "Files Fetched.",
            currentPath:  body.get("path"),
            files: files
        }
    }else{
        return {
            status: false,
            message: "Login Failed!"
        }
    }
}
