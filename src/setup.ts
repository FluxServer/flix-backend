import { prisma } from "./db"

await prisma.$connect();
console.log("🗄️ Database was connected!")

