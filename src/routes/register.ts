import { PrismaClient } from "@prisma/client";
import { Context } from "elysia";
import { parse } from "../utils/datarequest";
import { encrypt } from "../utils/sha256";

export const run = async (context: Context,prisma: PrismaClient) => {
    let body = await parse("auto", context);

    if((await prisma.user.count()) !== 0){
        return {
            status: false,
            message: "Cannot Initate after User is already created"
        }
    }

    let user = await prisma.user.create({
        data: {
            username: body.get("username"),
            displayName: body.get("displayName"),
            password: await encrypt(body.get("password")),
            user_type: 0,
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