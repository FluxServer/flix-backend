import { PrismaClient } from "@prisma/client";
import { Context } from "elysia";
import { adminAuth } from "../utils/auth";
import { networkInterfaces, totalmem, freemem, cpus, platform } from 'os';
import { f_rs_components_temperature, f_rs_disklist, f_rs_swapinfo } from "../features/flix_rs_pass";
import { EventEmitter } from "node:events"

export const run = async (context: Context, prisma: PrismaClient, eventEmitter: EventEmitter) => {
    let auth = await adminAuth(context, prisma);

    interface Disk {
        device: String,
        filesystem: String,
        type: String,
        removable: Boolean,
        mountPoint: String,
        used: String,
        total: String
    }

    if (auth !== null) {
        let interfaces = networkInterfaces();
        let disks_await:Array<Disk> = await f_rs_disklist(eventEmitter);
        let swap_info = await f_rs_swapinfo(eventEmitter);
        let cmp_temp = await f_rs_components_temperature(eventEmitter);

        var diskList:Array<Disk> = [];

        let cpu_list: Array<{ model: String, speed: String }> = [];

        cpus().forEach((cpu) => cpu_list.push({
            model: cpu.model,
            speed: `${Math.round(cpu.speed / 10) / 100} GHz`
        }))

        function formatBytes(bytes: number, decimals = 2) {
            if (!+bytes) return '0 Bytes'

            const k = 1024
            const dm = decimals < 0 ? 0 : decimals
            const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

            const i = Math.floor(Math.log(bytes) / Math.log(k))

            return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
        }

        disks_await.forEach((disk) => diskList.push({
            device: disk.device,
            filesystem: disk.filesystem,
            type: disk.type,
            removable: disk.removable,
            mountPoint: disk.mountPoint,
            used: formatBytes(parseInt(disk.used as string)),
            total: formatBytes(parseInt(disk.total as string))
        }))

        return {
            status: true,
            user_info: auth,
            network: {
                interfaces: interfaces
            },
            storage: {
                devices: diskList
            },
            components: cmp_temp,
            processor: cpu_list[0],
            memory: {
                swap: {
                    total: formatBytes(swap_info.totalSwap),
                    used: formatBytes(swap_info.usedSwap),
                    free: formatBytes(swap_info.freeSwap)
                },
                total: formatBytes(totalmem()),
                free: formatBytes(freemem()),
                used: formatBytes(totalmem() - freemem())
            }
        }
    } else {
        return {
            status: false,
            message: "Login Failed!"
        }
    }
}
