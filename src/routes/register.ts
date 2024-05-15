import { PrismaClient } from "@prisma/client";
import { Context } from "elysia";
import { parse } from "../utils/datarequest";
import { encrypt } from "../utils/sha256";

export const run = async (context: Context,prisma: PrismaClient) => {
    let body = await parse("auto", context);

    let user = await prisma.user.create({
        data: {
            username: body.get("username"),
            displayName: body.get("displayName"),
            password: await encrypt(body.get("password")),
            token: await encrypt(`${body.get("username")}-${body.get("password")}`)
        }
    })

    if(user){
        return {
            status: true,
            message: "Register Successfull",
            ...user
        }
    }else{
        return {
            status: false,
            message: "Register Failed!"
        }
    }
}