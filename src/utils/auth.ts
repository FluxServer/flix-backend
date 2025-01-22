import { PrismaClient } from "@prisma/client";
import { Context } from "elysia";

export const adminAuth = async (context: Context, prisma: PrismaClient) => {
    let token = context.request.headers.get("Authorization")?.replace("Token ", "") ?? '';
    let admin_fetch_data = await prisma.user.findFirst({
        where: { token:  token }
    })

    if(admin_fetch_data){
        return {
            status: true,
            ...admin_fetch_data
        }
    }else{
        throw {
            status: false,
            message: "Tokenization Failed"
        }
    }
}