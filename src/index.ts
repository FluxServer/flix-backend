import { Context, Elysia } from "elysia"
import { cors } from "@elysiajs/cors"
import { prisma } from "./db"
import { start_process_management } from "./features/process-management"
import { EventEmitter } from "node:events"
import { adminAuth } from "./utils/auth"
import { create_site_files } from "./features/site-management"
import { f_rs_information, f_rs_sslexpirydate } from "./features/flix_rs_pass"
import { staticPlugin } from '@elysiajs/static'

const app = new Elysia()
    .use(cors())
    .use(staticPlugin({
        assets: "v1_panel",
        prefix: "/v1_panel",
        maxAge: (process.env['DEBUG'] as unknown as number) == 1 ? 0 : 1200
    }))

let sockets: any = [];
let list: String = "";

const eventEmitter = new EventEmitter();

start_process_management(prisma, eventEmitter);
create_site_files(prisma, eventEmitter);

eventEmitter.on('process_management', (data) => {
    eventEmitter.emit("list-running-process");
});

eventEmitter.on('flixrs-output', (data) => forward("flix-rust", { data: data }));

eventEmitter.on("running-process", async (_list: string) => {
    list = _list;
    console.log(`🛠️  New List Fetched ${list}`)
})

async function forward(event: String, data: any) {
    for (var wsend of sockets) {
        wsend({
            event: event,
            ...data
        })
    }
}

app.get("/v1_panel" , () => Bun.file("v1_panel/index.html"))
app.ws('/wssocket', {
    async message(ws, message: any) {
        if (message.event == "login") {
            let admin_fetch_data = await prisma.user.findFirst({
                where: { token:  message.token }
            })
            if(admin_fetch_data){
                ws.send({ event: "ready", message: "Login Sucessfully" })
                sockets.push(ws.send);
            }else{
                ws.close();
            }
        }
        if(message.event == "rusinfo"){
            await f_rs_information(eventEmitter)
        }
    }
})

app.post("/v1/login", async (context: Context) => (await import("./routes/login")).run(context, prisma))
app.post("/v1/register", async (context: Context) => (await import("./routes/register")).run(context, prisma))

app.get("/v1/auth/sysinfo", async (context: Context) => (await import("./routes/sysinfo")).run(context, prisma, eventEmitter))

// *Applications
app.get("/v1/auth/app/list", async (context: Context) => (await import("./routes/apps/list")).run(context, prisma, eventEmitter, list))
app.post("/v1/auth/app/new", async (context: Context) => (await import("./routes/apps/new")).run(context, prisma, eventEmitter))
app.post("/v1/auth/app/delete", async (context: Context) => (await import("./routes/apps/delete")).run(context, prisma, eventEmitter))
app.post("/v1/auth/app/stop", async (context: Context) => (await import("./routes/apps/stop")).run(context, prisma, eventEmitter))
app.post("/v1/auth/app/start", async (context: Context) => (await import("./routes/apps/start")).run(context, prisma, eventEmitter))

// *Services
app.get("/v1/auth/services/list", async (context: Context) => (await import("./routes/sys-services/running-services")).run(context, prisma))
app.post("/v1/auth/services/restart", async (context: Context) => (await import("./routes/sys-services/restart-service")).run(context, prisma))
app.post("/v1/auth/services/stop", async (context: Context) => (await import("./routes/sys-services/stop-service")).run(context, prisma))

// *Websites
app.get("/v1/auth/sites/list", async (context: Context) => (await import("./routes/sites/list")).run(context, prisma, eventEmitter))
app.post("/v1/auth/sites/new", async (context: Context) => (await import("./routes/sites/new")).run(context, prisma, eventEmitter))
app.post("/v1/auth/sites/delete", async (context: Context) => (await import("./routes/sites/delete")).run(context, prisma, eventEmitter))
app.post("/v1/auth/sites/ssl-new", async (context: Context) => (await import("./routes/sites/new-ssl")).run(context, prisma, eventEmitter))

// *Users
app.get("/v1/auth/users/list", async (context: Context) => (await import("./routes/users/list")).run(context, prisma))
app.post("/v1/auth/users/new", async (context: Context) => (await import("./routes/users/new")).run(context, prisma))
app.post("/v1/auth/users/edit", async (context: Context) => (await import("./routes/users/edit")).run(context, prisma))
app.post("/v1/auth/users/delete", async (context: Context) => (await import("./routes/users/delete")).run(context, prisma))

// *Files
app.post("/v1/auth/files/list", async (context: Context) => (await import("./routes/files/list")).run(context, prisma, eventEmitter))
app.post("/v1/auth/files/upload", async (context: Context) => (await import("./routes/files/upload")).run(context, prisma, eventEmitter))
app.post("/v1/auth/files/view", async (context: Context) => (await import("./routes/files/view")).run(context, prisma))
app.post("/v1/auth/files/edit", async (context: Context) => (await import("./routes/files/edit")).run(context, prisma))
app.post("/v1/auth/files/rename", async (context: Context) => (await import("./routes/files/rename")).run(context, prisma))
app.post("/v1/auth/files/new-directory", async (context: Context) => (await import("./routes/files/new-directory")).run(context, prisma))
// *Files[Trash]
app.post("/v1/auth/files/trash/move", async (context: Context) => (await import("./routes/files/trash/move")).run(context, prisma))
app.post("/v1/auth/files/trash/restore", async (context: Context) => (await import("./routes/files/trash/restore")).run(context, prisma))
app.get("/v1/auth/files/trash/list", async (context: Context) => (await import("./routes/files/trash/list")).run(context, prisma))
// *Files[Compression & Decompression]
app.post("/v1/auth/files/7z/compress", async (context: Context) => (await import("./routes/files/compress")).run(context, prisma, eventEmitter))
app.post("/v1/auth/files/7z/decompress", async (context: Context) => (await import("./routes/files/decompress")).run(context, prisma, eventEmitter))

await prisma.$connect()
console.log("🗄️  Database was connected!")

console.log(`🦀 Using FlixRs Runtime at ${process.env['FLIXRS_RUNTIME']}`);

app.listen(process.env.PORT as string, () => console.log(`🦊 Server started at ${app.server?.url.origin}`))
