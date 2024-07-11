import { PrismaClient } from "@prisma/client";
import { Context } from "elysia";
import { adminAuth } from "../../utils/auth";

export const run = async (context: Context,prisma: PrismaClient) => {
    let auth = await adminAuth(context, prisma);

    if(auth !== null){
        let isNginxRunning = (await Bun.spawnSync(['systemctl', 'is-active' , 'nginx'])).stdout.toString().trim()
        let isMongoDRunning = (await Bun.spawnSync(['systemctl', 'is-active' , 'mongod'])).stdout.toString().trim()
        let isMysqlRunning = (await Bun.spawnSync(['systemctl', 'is-active' , 'mysql'])).stdout.toString().trim()
        let isDockerRunning = (await Bun.spawnSync(['systemctl', 'is-active' , 'docker'])).stdout.toString().trim()
        let isiPHP81Running = (await Bun.spawnSync(['systemctl', 'is-active' , 'php8.1-fpm'])).stdout.toString().trim()
        let isiPHP83Running = (await Bun.spawnSync(['systemctl', 'is-active' , 'php8.3-fpm'])).stdout.toString().trim()

        return {
            status: true,
            message: "Service Status Fetch Successfull!",
            services: {
                nginx: isNginxRunning,
                mongodb: isMongoDRunning,
                mysql: isMysqlRunning,
                docker: isDockerRunning,
                php_8_1: isiPHP81Running,
                php_8_3: isiPHP83Running
            }
        }
    }else{
        return {
            status: false,
            message: "Login Failed!"
        }
    }
}