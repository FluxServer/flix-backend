import { PrismaClient } from "@prisma/client";
import { Context } from "elysia";
import { adminAuth } from "../../utils/auth";
import { writeFileSync, existsSync } from "node:fs";

export const run = async (context: Context, prisma: PrismaClient) => {
    let auth = await adminAuth(context, prisma);
    let data = await context.request.text();

    if(auth !== null){
        const lines = data.split('\n');
        const path = lines[0];

        if(await existsSync(path)){
            if (lines.length > 1) {
                lines.shift();
            }

            const modifiedContent = lines.join('\n');

            await writeFileSync(path , modifiedContent);

            return {
                status: true,
                message: "File Editied Successfully!"
            }
        }else{
            if (lines.length > 1) {
                lines.shift();
            }

            const modifiedContent = lines.join('\n');

            await writeFileSync(path , modifiedContent);

            return {
                status: true,
                message: "File Editied Successfully!"
            }
        }
    }else{
        return {
            status: false,
            message: "Login Failed!"
        }
    }
}
