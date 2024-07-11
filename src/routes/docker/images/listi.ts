import { PrismaClient } from "@prisma/client";
import { Context } from "elysia";
import { adminAuth } from "../../../utils/auth";
import { dockerFetch } from "../../../utils/docker-api";

export const run = async (context: Context,prisma: PrismaClient) => {
    let auth = await adminAuth(context, prisma);

    if(auth !== null){
        let response = await dockerFetch("/v1.45/images/json?all=true");

        return {
            status: true,
            images: response
        }
    }else{
        return {
            status: false,
            message: "Login Failed!"
        }
    }
}