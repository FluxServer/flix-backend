import { PrismaClient } from "@prisma/client";
import { Context } from "elysia";
import { adminAuth } from "../../utils/auth";

export const run = async (context: Context, prisma: PrismaClient) => {
    let auth = await adminAuth(context, prisma);

    if(auth){
        if(auth.user_type == 0){
            let users = await prisma.user.findMany();

            return {
                status: true,
                data: users
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