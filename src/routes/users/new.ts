import { PrismaClient } from "@prisma/client";
import { Context } from "elysia";
import { adminAuth } from "../../utils/auth";
import { parse } from "../../utils/datarequest";
import { encrypt } from "../../utils/sha256";

export const run = async (context: Context, prisma: PrismaClient) => {
    let auth = await adminAuth(context, prisma);
    let body = await parse("auto" , context);

    if(auth){
        if(auth.user_type == 0){
            let findSameUser = await prisma.user.count({
                where: {
                    username: body.get("username"),
                }
            });

            if(findSameUser !== 0) return {
                status: false,
                message: "User with Same Creditnals already exist"
            }

            let user = await prisma.user.create({
                data: {
                    username: body.get("username"),
                    displayName: body.get("displayName"),
                    password: await encrypt(body.get("password")),
                    user_type: 1,
                    token: await encrypt(`${body.get("username")}-${body.get("password")}`)
                }
            })

            if(user){
                return {
                    status: true,
                    message: "User Creation Successfull",
                    data: user,
                }
            }else{
                return {
                    status: false,
                    message: "Something Went Wrong"
                }
            }
        }else{
            return {
                status: false,
                message: "Not allowed to view resource"
            }
        }
    }else{
        return {
            status: false,
            message: "Login Failed!"
        }
    }
}