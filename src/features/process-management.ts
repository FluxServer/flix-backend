import { PrismaClient } from "../db";
import { join } from "path";
import { mkdir } from "node:fs/promises";
import * as fs from "node:fs";
import { spawn } from "node:child_process";
import { config as loadEnv } from "dotenv";
import { EventEmitter } from "node:events"

export const start_process_management = async (prisma: PrismaClient, eventEmitter: EventEmitter) => {
    try {
        const applications = await prisma.application.findMany();

        for (const application of applications) {
            let pid = null;

            eventEmitter.on("start-process" , (id) => {
                if(id == application.application_id) if(pid == null) start_process();
            })

            if(application.application_enabled == true) start_process();

            async function start_process() {
                // Load environment variables from the application's .env file
                const envFilePath = join(application.application_run_dir, '.env');
                let envVars: any = {};

                try {
                    envVars = loadEnv({ path: envFilePath }).parsed;
                } catch (err) {
                    console.warn(`No .env file found for ${application.application_name}, using default environment.`);
                }

                // Create the directory for the application's output logs
                await mkdir(join('user_dir', 'outputs', application.application_name), { recursive: true });

                // Create a writable stream for the output log file
                const filePath = join('user_dir', 'outputs', application.application_name, 'output.log');
                const error_filePath = join('user_dir', 'outputs', application.application_name, 'error.log');

                const fileStream = fs.createWriteStream(filePath, { flags: 'a' });
                const error_fileStream = fs.createWriteStream(error_filePath, { flags: 'a' });

                // Spawn the shell process to run the application command
                const proc = spawn('sh', [], {
                    cwd: application.application_run_dir,
                    stdio: ['pipe', 'pipe', 'pipe'],
                    env: {
                        ...process.env,
                        ...envVars // Include variables loaded from the .env file
                    }
                });

                eventEmitter.emit('process_management', {
                    method: "start",
                    process: application.application_id
                })
                // Write the command to the shell's stdin and close stdin
                proc.stdin.write(`${application.application_runtime}\n`);
                proc.stdin.end();

                // Handle the process output and write it directly to the file stream
                proc.stdout.on('data', (chunk) => {
                    fileStream.write(chunk.toString());
                });

                // Handle the process error output and write it directly to the file stream
                proc.stderr.on('data', (chunk) => {
                    fileStream.write(`${chunk.toString()}`);
                });

                // Handle process completion
                proc.on('close', (code) => {
                    error_fileStream.write(`Process exited with code ${code}\n`);
                    error_fileStream.end();
                    fileStream.end();
                });

                // Handle process errors
                proc.on('error', (err) => {
                    console.error('Failed to start process:', err);
                    error_fileStream.write(`Failed to start process: ${err.message}\n`);
                    fileStream.end();
                });

                eventEmitter.on("stop-process" , (id) => {
                    if(id == application.application_id){
                        proc.kill();
                        eventEmitter.emit('process_management', {
                            method: "stop",
                            process: application.application_id
                        })
                    }
                })
            }
        }
    } catch (err) {
        console.error('Error managing processes:', err);
    }
};
