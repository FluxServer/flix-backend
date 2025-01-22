import { PrismaClient } from "@prisma/client";
import { Context } from "elysia";
import { adminAuth } from "../../utils/auth";
import { dockerFetch, dockerSend } from "../../utils/docker-api";
import { parse } from "../../utils/datarequest";

export const run = async (context: Context,prisma: PrismaClient) => {
    let auth = await adminAuth(context, prisma);
    let body = await parse("auto" , context);

    if(auth !== null){
        let response = await dockerSend(`/v1.45/containers/${body.get("id")}/${body.get("action")}` , {});

        console.log(response)

        return {
            status: true,
            data: response
        }
    }else{
        return {
            status: false,
            message: "Login Failed!"
        }
    }
}