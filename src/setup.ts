import { prisma } from "./db"
import { mkdirSync } from "node:fs";

await prisma.$connect();
console.log("🗄️ Database was connected!")

await mkdirSync("/www/flix/user_dir/.trash");