import { PrismaClient } from "@prisma/client";
import { Context } from "elysia";
import { adminAuth } from "../../utils/auth";
import { EventEmitter } from "node:events"

export const run = async (context: Context,prisma: PrismaClient,eventEmitter: EventEmitter,list: String) => {
    let auth = await adminAuth(context, prisma);

    let applications = await prisma.application.findMany();

    if(auth !== null){
        let app_list: { application_running: boolean; application_id: number; application_name: string; application_runtime: string; application_run_dir: string; application_enabled: boolean; }[] = [];
        eventEmitter.emit("list-running-process")
        await applications.forEach(async (application) => {
            await app_list.push({
                ...application,
                application_running: list.includes(`[${application.application_id}]`)
            })
        })

        return {
            status: true,
            message: "Application Fetched Successfully!",
            data: app_list
        }
    }else{
        return {
            status: false,
            message: "Login Failed!"
        }
    }
}