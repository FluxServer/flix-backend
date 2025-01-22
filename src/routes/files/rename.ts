import { PrismaClient } from "@prisma/client";
import { Context } from "elysia";
import { adminAuth } from "../../utils/auth";
import { parse } from "../../utils/datarequest";
import { renameSync } from "node:fs";
import { join } from "node:path";

export const run = async (context: Context, prisma: PrismaClient) => {
    let auth = await adminAuth(context, prisma);
    let body = await parse("auto", context);

    if(auth !== null){
        let path = body.get("path");
        let file = body.get("file");
        let new_name = body.get("newName");

        await renameSync(
            join(path, file),
            join(path , new_name)
        )

        return {
            status: true,
            message: "Renamed Successfully"
        }
    }else{
        return {
            status: false,
            message: "Login Failed!"
        }
    }
}
