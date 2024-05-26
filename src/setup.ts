import { join } from "path";

let dbPath = join("/www" , "flix" , "user_dir" , "database.db")
let envPath = join("/www" , "flix" , ".env");
let flix_rs_runtime = join("/www" , "flix" , "target" , "debug" , "flix")

let email = prompt("E-Mail Address? ");
let defaultPort = prompt("Flix Listening Port? (Default: 3000) : " , "3000")

let envRAW = `EMAIL=${email ?? 'preknolwedge@gmail.com'}
# Runtimes
FLIXRS_RUNTIME=${flix_rs_runtime}
UNZIP_RUNTIME=/usr/bin/unzip
# Database
DATABASE_URL="file:${dbPath}"
# Site Ports
PORT=${defaultPort || 3000}
# Mysql Informations
HOST=127.0.0.1
USERNAME=
PASSWORD=`;

await Bun.write(envPath, envRAW);