import { PrismaClient } from "@prisma/client";
import { Context } from "elysia";
import { adminAuth } from "../../../utils/auth";
import { parse } from "../../../utils/datarequest";
import { writeFileSync, statSync, rmSync, renameSync } from "node:fs";
import { join } from "node:path";

export const run = async (context: Context, prisma: PrismaClient) => {
    let auth = await adminAuth(context, prisma);
    let body = await parse("auto", context);

    if(auth !== null){
        let path = body.get("path");
        const object:string = body.get("object");
        let j_path = join(path);

        if(object.startsWith(".trash-")){
            await rmSync(join(path, object));
            return {
                status: true,
                message: "Trash Deleted Successfully!"
            }
        }

        let stat = await statSync(j_path);

        const hasher = new Bun.CryptoHasher("md4");

        hasher.update(`file:${object}:${stat.size}`);
        let hash = hasher.digest('hex').toString();

        let new_trash_path = join(process.cwd() , 'user_dir' , '.trash', `.trash-${hash}`)
        let trans_info = join(process.cwd() , 'user_dir' , '.trash', `.info-${hash}`)

        await renameSync(j_path , new_trash_path);
        await writeFileSync(trans_info, JSON.stringify({
            oldName: object,
            oldPath: j_path,
            isDirectory: stat.isDirectory()
        }))

        return {
            status: false,
            message: "Moved to trash Successfully"
        }
    }else{
        return {
            status: false,
            message: "Login Failed!"
        }
    }
}
