import { prisma } from "./db"

await prisma.$connect();
console.log("🗄️ Database was connected!")

let db = await prisma.site.update({
    where: {
        site_id: 2
    },
    data:{
        site_domain_1: "ipv62.prtechindia.com"
    }
})

console.log(db)