import { PrismaClient } from "@prisma/client";
import { Context } from "elysia";
import { adminAuth } from "../../utils/auth";
import { EventEmitter } from "node:events";
import { parse } from "../../utils/datarequest";
import { readdirSync, statSync } from "node:fs";
import { join, extname, dirname } from "node:path";

export const run = async (context: Context, prisma: PrismaClient, eventEmitter: EventEmitter) => {
    let auth = await adminAuth(context, prisma);
    let body = await parse("auto", context);

    if (auth !== null) {
        try {
            return runFiles();
        } catch (e) {
            return {
                status: false,
                message: "Error running files."
            };
        }

        function runFiles() {
            const basePath = body.get("path");
            let directoryPath;
            if (process.platform === "win32") {
                if (basePath.match(/^[a-zA-Z]:$/)) {
                    // Drive letter without trailing backslash
                    directoryPath = basePath + "\\";
                } else if (basePath.match(/^[a-zA-Z]:\\?$/)) {
                    // Drive letter with trailing backslash
                    directoryPath = basePath;
                } else {
                    // Non-drive letter path
                    directoryPath = join(basePath === "/" ? "" : basePath, ".");
                }
            } else {
                // Unix-based system
                directoryPath = basePath === "/" ? basePath : join(basePath, ".");
            }
        
            let files = readdirSync(directoryPath);
        
            var fileDetails = files.map(file => {
                const filePath = join(directoryPath, file);
                const stat = statSync(filePath);
                return {
                    file_path: filePath,
                    name: file,
                    size: formatBytes(stat.size),
                    is_binary: stat.isFile(),
                    extname: extname(file),
                    is_directory: stat.isDirectory()
                };
            });
        
            return {
                status: true,
                message: "Files Fetched.",
                currentPath: basePath,
                files: fileDetails
            };
        }
        
    } else {
        return {
            status: false,
            message: "Login Failed!"
        };
    }
};

// Function to format bytes
function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
