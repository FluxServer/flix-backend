import { PrismaClient } from "../db";
import { join } from "path";
import * as fs from "node:fs";
import { EventEmitter } from "node:events"
import { template } from "../utils/templates";

export const create_site_files = async (prisma: PrismaClient, eventEmitter: EventEmitter) => {
    let sites = await prisma.site!.findMany();
    

    for (var site of sites) {
        siteCreateFile(site.site_id);
    }

    eventEmitter.on("init-re-init-site" , async (id:number) => {
        siteCreateFile(id);
        await Bun.spawnSync(['systemctl' , 'reload', 'nginx']);
    });

    eventEmitter.on("reload" , async (id: number) => {
        let site = await prisma.site.findFirst({
            where: {
                site_id: id
            }
        });

        let wellKnown = join(process.cwd(), 'user_dir', 'sites', site!.site_domain_1, '.well-known');

        if(fs.existsSync(join(wellKnown, 'lock'))){
            await fs.rmSync(join(wellKnown, 'lock'));
        }

        siteCreateFile(id);

        await Bun.spawnSync(['systemctl' , 'reload', 'nginx']);
    })

    async function siteCreateFile(id:number) {
        let site = await prisma.site.findFirst({
            where: {
                site_id: id
            }
        });
        
        let webDir = join(process.cwd(), 'user_dir', 'sites', site!.site_domain_1 );
        let dirFile = join(process.cwd(), 'user_dir', 'sites', site!.site_domain_1, 'public_html');
        let wellKnown = join(process.cwd(), 'user_dir', 'sites', site!.site_domain_1, '.well-known');

        if(!fs.existsSync(join(wellKnown, 'lock'))){
            console.log(`🔓 ${site!.site_domain_1} is not Locked.. Locking`)

            let __template = await template("nginx-web.conf", "nginx", {
                site_domain: site!.site_domain_1,
                site_ssl_enabled: site!.site_ssl_enabled,
                site_proxy_enabled: site!.site_proxy_enabled,
                site_proxy_port: site!.site_proxy_port,
                site_php_enabled: site!.site_php_enabled,
                site_config: site?.site_config as String,
                site_php_version: site!.site_php_version,
                site_ssl_crt_file: site!.site_ssl_crt_file,
                site_ssl_key_file: site!.site_ssl_key_file
            })

            await prisma.site.update({
                where: {
                    site_id: site?.site_id,
                },
                data: {
                    site_directory: webDir
                }
            })
    
            await Bun.write(join(process.cwd(), 'user_dir', 'sites-available', `${site!.site_domain_1}.conf`), __template);
            if (!fs.existsSync(dirFile)) {
                await Bun.write(join(dirFile, 'index.html'),
                    `<h5>Site Created by Flix-PrTech Domain (${site!.site_domain_1})</h5>`, { createPath: true });
            }
    
            await Bun.write(join(wellKnown, 'lock'),`SITELOCK-${Date.now()}`, { createPath: true });
            await Bun.write(join(wellKnown, 'acme-challenge' , 'lock'),`SITELOCK-${Date.now()}`, { createPath: true });
        
            if(process.platform == "win32"){

            }else{
                let _process = await Bun.spawnSync(['systemctl' , 'reload', 'nginx']);
        
                if(_process.exitCode !== 0){
                    console.log(`🚫 Failed to Reload nginx Service`);
                }else{
                    console.log(`⟳  Successfully Reloaded nginx Service`);
                }
            }
        }else{
            console.log(`🔒 ${site!.site_domain_1} is Locked`)
        }
    }

    if(process.platform == "win32"){

    }else{
        let _process = await Bun.spawnSync(['systemctl' , 'reload', 'nginx']);

        if(_process.exitCode !== 0){
            console.log(`🚫 Failed to Reload nginx Service`);
        }else{
            console.log(`⟳  Successfully Reloaded nginx Service`);
        }
    }
}