import { PrismaClient } from "@prisma/client";
import { Context } from "elysia";
import { adminAuth } from "../../utils/auth";
import { parse } from "../../utils/datarequest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const run = async (context: Context, prisma: PrismaClient) => {
    let auth = await adminAuth(context, prisma);
    if(auth !== null){
        let urlSearchParam = new URL(context.request.url);
        let path:string = urlSearchParam.searchParams.get("path") as string;

        return Bun.file(join(path))
    }else{
        return {
            status: false,
            message: "Login Failed!"
        }
    }
}
