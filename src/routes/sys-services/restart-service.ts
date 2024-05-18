import { PrismaClient } from "@prisma/client";
import { Context } from "elysia";
import { adminAuth } from "../../utils/auth";
import { parse } from "../../utils/datarequest";

export const run = async (context: Context,prisma: PrismaClient) => {
    let auth = await adminAuth(context, prisma);
    let body = await parse("auto", context);

    if(auth !== null){
        let systemctl_restart = (await Bun.spawnSync(['systemctl', 'restart' , body.get("service")])).stdout.toString();
        return {
            status: true,
            message: "Service Restarted Successfully!",
            output: systemctl_restart
        }
    }else{
        return {
            status: false,
            message: "Login Failed!"
        }
    }
}