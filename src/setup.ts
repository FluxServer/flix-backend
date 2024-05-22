import { prisma } from "./db"
import { mkdirSync } from "node:fs";

await prisma.$connect();
console.log("🗄️ Database was connected!")
