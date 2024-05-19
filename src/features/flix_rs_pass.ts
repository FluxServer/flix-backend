import { EventEmitter } from "node:events";
import { spawn } from "node:child_process";
import { PrismaClient } from "@prisma/client";
import { join } from "node:path";

const FLIX_RS_RUNTIME:string = process.env['FLIXRS_RUNTIME'] as string

export const f_rs_information = (eventEmitter: EventEmitter): Promise<any> => {
    return new Promise((resolve, reject) => {
        try {
            execute_rs_runtime(
                {
                    action: "verinfo"
                },
                eventEmitter,
                async (_data: any) => {
                    resolve(_data);
                },
                async function (_code:number) {
                    
                }
            );
        } catch (error) {
            reject(error);
        }
    });
};

export const f_rs_sslexpirydate = (eventEmitter: EventEmitter,domain: string) => {
    return new Promise((resolve, reject) => {
        execute_rs_runtime(
            {action : "ssl-exp-info" , domain: domain},
            eventEmitter,
            async (_data: string) => {
                if(_data.startsWith(">info ")){
                    let date = _data.replace(">info ", "");
    
                    const new_date:Date = new Date(date + " GMT");
                    const today_date = new Date();

                    const differenceInMilliseconds = new_date.getTime() - today_date.getTime();
                    const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));

                    const timestamp:number = new_date.getTime();
    
                    if (timestamp < Date.now()) {
                        resolve({
                            expired: false,
                            daysLeft: 0
                        })
                    }else{
                        resolve({
                            expired: false,
                            daysLeft: differenceInDays
                        });
                    }
                }
            },
            async function (_code:number) {
                if(_code !== 0) reject(_code);
            }
        )
    });
}

export const f_rs_create_ssl = (eventEmitter: EventEmitter,prisma: PrismaClient ,site_id: number,domain: String,email: String): Promise<any> => {
    return new Promise((resolve, reject) => {
        try{
            execute_rs_runtime(
                { action: "new_ssl" , email: email , domain: domain },
                eventEmitter,
                async (_data: any) => {},
                async function (_code:number) {
                    if(_code == 0){
                        await prisma.site.update({
                            where: {
                                site_id: site_id
                            },
                            data: {
                                site_ssl_enabled: true,
                                site_ssl_crt_file: `/www/flix/user_dir/sites/${domain}/cert_file.crt`,
                                site_ssl_key_file: `/www/flix/user_dir/sites/${domain}/cert_public.key`,
                            }
                        })

                        // remove lock
                        await (await import("node:fs")).rmSync(`/www/flix/user_dir/sites/${domain}/.well-known/lock`)

                        resolve(true);
                    }else{
                        resolve(false);
                    }
                }
            )
        }catch(error){
            reject(error);
        }
    });
}

const execute_rs_runtime = (json: Object,eventEmitter: EventEmitter, callback: Function, exit: Function) => {
    let json_stringify_base64 = btoa(JSON.stringify(json));

    let process_spawn = spawn(FLIX_RS_RUNTIME, [json_stringify_base64],{
        stdio: ['pipe', 'pipe', 'pipe'],
    })

    process_spawn.stdout.on('data', (chunk) => {
        eventEmitter.emit("flixrs-output" , chunk.toString());
        callback(chunk.toString())
    });

    process_spawn.stderr.on('data', (chunk) => {
        eventEmitter.emit("flixrs-output" , chunk.toString());
        callback(chunk.toString());
    });

    process_spawn.on('close', (code) => {
        eventEmitter.emit("flixrs-output" , `\nClosed at *${code}\n`);
        callback(code?.toString());
        exit(code);
    });

    process_spawn.on('error', (err) => {
        eventEmitter.emit("flixrs-output" , err.toString());
    })
}