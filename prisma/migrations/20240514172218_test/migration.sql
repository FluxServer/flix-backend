-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "displayName" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Site" (
    "site_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "site_domain_1" TEXT NOT NULL,
    "site_domain_2" TEXT NOT NULL,
    "site_directory" TEXT NOT NULL,
    "site_ssl_enabled" BOOLEAN NOT NULL DEFAULT false,
    "site_ssl_crt_file" TEXT NOT NULL,
    "site_ssl_key_file" TEXT NOT NULL,
    "site_proxy_enabled" BOOLEAN NOT NULL DEFAULT false,
    "site_proxy_port" INTEGER NOT NULL DEFAULT 8080,
    "site_application_link" INTEGER
);

-- CreateTable
CREATE TABLE "Application" (
    "application_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "application_name" TEXT NOT NULL,
    "application_runtime" TEXT NOT NULL DEFAULT 'bun run ./index.js',
    "application_run_dir" TEXT NOT NULL,
    "application_enabled" BOOLEAN NOT NULL DEFAULT true
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Site_site_domain_1_key" ON "Site"("site_domain_1");

-- CreateIndex
CREATE UNIQUE INDEX "Site_site_domain_2_key" ON "Site"("site_domain_2");
