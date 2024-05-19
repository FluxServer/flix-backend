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
        var files:Array<{file_path: string,name: string,size: string,is_binary: Boolean,extname: String,is_directory: Boolean}> = [];

        // Source : https://web.archive.org/web/20120507054320/http://codeaid.net/javascript/convert-size-in-bytes-to-human-readable-format-(javascript)
        function formatBytes(bytes:number, decimals = 2) {
            if (!+bytes) return '0 Bytes'
        
            const k = 1024
            const dm = decimals < 0 ? 0 : decimals
            const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
        
            const i = Math.floor(Math.log(bytes) / Math.log(k))
        
            return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
        }

        _files.forEach(async file => {
            let path = join(body.get("path"), file);
            let stat = await statSync(path);
            files.push({
                file_path: path,
                name: file,
                size: formatBytes(stat.size),
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
