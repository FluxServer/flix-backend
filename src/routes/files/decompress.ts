import { PrismaClient } from "@prisma/client";
import { Context } from "elysia";
import { adminAuth } from "../../utils/auth";
import { EventEmitter } from "node:events"
import { parse } from "../../utils/datarequest";
import { f_rs_decompress } from "../../features/flix_rs_pass";

export const run = async (context: Context, prisma: PrismaClient, eventEmitter: EventEmitter) => {
    let auth = await adminAuth(context, prisma);
    let body = await parse("auto", context);

    if(auth !== null){
        let _compress_rs = await f_rs_decompress(
            body.get("input"),
            body.get("output"),
            body.get("password"),
            eventEmitter
        );

        if(_compress_rs) {
            return {
                status: true,
                message: "File Successfully Decompressed"
            }
        }else{
            return {
                status: false,
                message: "File Decompression Failed"
            }
        }
    }else{
        return {
            status: false,
            message: "Login Failed!"
        }
    }
}
