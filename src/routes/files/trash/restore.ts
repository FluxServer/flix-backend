import { PrismaClient } from "@prisma/client";
import { Context } from "elysia";
import { adminAuth } from "../../../utils/auth";
import { parse } from "../../../utils/datarequest";
import { writeFileSync, readFileSync, rmSync, renameSync } from "node:fs";
import { join } from "node:path";

export const run = async (context: Context, prisma: PrismaClient) => {
    let auth = await adminAuth(context, prisma);
    let body = await parse("auto", context);

    if(auth !== null){
        let trash_path = join(process.cwd() , 'user_dir' , '.trash')

        let trashFile = join(trash_path , `.trash-${body.get("trash_id")}`)
        let trashInfo = join(trash_path , `.info-${body.get("trash_id")}`)
        let trashJsonInfo = JSON.parse(await readFileSync(trashInfo,{
            encoding: 'utf8'
        }))

        renameSync(trashFile , trashJsonInfo.oldPath)
        rmSync(trashInfo);

        return {
            status: true,
            message: `File ${trashJsonInfo.oldName} restored successfully!`
        }
    }else{
        return {
            status: false,
            message: "Login Failed!"
        }
    }
}
