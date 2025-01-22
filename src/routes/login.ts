import { PrismaClient } from "@prisma/client";
import { Context } from "elysia";
import { parse } from "../utils/datarequest";
import { encrypt } from "../utils/sha256";

export const run = async (context: Context,prisma: PrismaClient) => {
    let body = await parse("auto", context);

    let user = await prisma.user.findFirst({
        where: { username: body.get("username"), password: await encrypt(body.get("password"))}
    })

    if(user){
        return {
            status: true,
            message: "Login Successfull",
            ...user
        }
    }else{
        return {
            status: false,
            message: "Login Failed!"
        }
    }
}