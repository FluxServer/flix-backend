import { Context, Elysia } from "elysia"
import { cors } from "@elysiajs/cors"
import { prisma } from "./db"
import { start_process_management } from "./features/process-management"
import { EventEmitter } from "node:events"
import { adminAuth } from "./utils/auth"

const app = new Elysia()
.use(cors())

let sockets:any = [];

const eventEmitter = new EventEmitter();

start_process_management(prisma, eventEmitter);

eventEmitter.on('process_management', (data) => {
    console.log(data);
});

app.ws('/wssocket' , {
    async message(ws, message) {
        let auth = await adminAuth(ws.data as Context,prisma);

        if(auth.status == false){
            ws.close();
        }else{
            sockets.push(ws.send);
        }
    }
})

app.post("/v1/login" , async (context: Context) => (await import("./routes/login")).run(context, prisma))
app.post("/v1/register" , async (context: Context) => (await import("./routes/register")).run(context, prisma))

await prisma.$connect()
console.log("🗄️ Database was connected!")

app.listen(process.env.PORT as string, () => console.log(`🦊 Server started at ${app.server?.url.origin}`))
