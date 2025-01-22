import { PrismaClient } from "@prisma/client";
import { Context } from "elysia";
import { adminAuth } from "../../../utils/auth";
import { EventEmitter } from "node:events"
import { parse } from "../../../utils/datarequest";
import { readdirSync, statSync, readFileSync } from "node:fs";
import { join, extname } from "node:path";

export const run = async (context: Context, prisma: PrismaClient) => {
    let auth = await adminAuth(context, prisma);
    let body = await parse("auto", context);

    if(auth !== null){
        let _trashPath = join(process.cwd() , 'user_dir', '.trash');
        let _files = readdirSync(_trashPath);

        var files:Array<{file_path: string,trash_id: String,name: string,size: string,is_binary: Boolean,extname: String,is_directory: Boolean}> = [];

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
            if(file.startsWith(".info-")) return;
            let path = join(_trashPath, file);
            let stat = await statSync(path);
            let inf_data = await readFileSync(join(_trashPath , `.info-${file.replace(".trash-", "")}`), {encoding: 'utf8'});
            let infoFile = JSON.parse(inf_data)
            files.push({
                file_path: path,
                trash_id: file.replace(".trash-", ""),
                name: infoFile.oldName,
                size: formatBytes(stat.size),
                is_binary: stat.isFile(),
                extname: extname(infoFile.oldName),
                is_directory: infoFile.isDirectory
            });
        });

        return {
            status: true,
            message: "Files Fetched.",
            currentPath:  _trashPath,
            files: files
        }
    }else{
        return {
            status: false,
            message: "Login Failed!"
        }
    }
}
