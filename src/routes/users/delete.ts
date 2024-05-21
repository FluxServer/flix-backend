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
            let user = await prisma.user.findFirst({
                where: {
                    id: body.get("id")
                }
            })

            if(user){
                if(user.user_type == 0){
                    return {
                        status: false,
                        message: "Root Users cannot be removed."
                    }
                }

                let any_site = await prisma.site.count({
                    where: {
                        site_owned_by: user.id
                    }
                })

                if(any_site == 0){
                    await prisma.user.delete({
                        where: {
                            id: user.id
                        }
                    })

                    return {
                        status: true,
                        message: "User has been safely deleted!"
                    }
                }else{
                    return {
                        status: false,
                        message: "This User Owns Some Websites Either Delete them or Transfer 'em."
                    }
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