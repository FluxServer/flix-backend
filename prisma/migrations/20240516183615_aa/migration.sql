-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Site" (
    "site_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "site_domain_1" TEXT NOT NULL,
    "site_domain_2" TEXT NOT NULL,
    "site_directory" TEXT NOT NULL,
    "site_ssl_enabled" BOOLEAN NOT NULL DEFAULT false,
    "site_ssl_crt_file" TEXT NOT NULL,
    "site_ssl_key_file" TEXT NOT NULL,
    "site_php_enabled" BOOLEAN NOT NULL DEFAULT false,
    "site_php_version" TEXT NOT NULL DEFAULT '8.1',
    "site_proxy_enabled" BOOLEAN NOT NULL DEFAULT false,
    "site_proxy_port" INTEGER NOT NULL DEFAULT 8080,
    "site_application_link" INTEGER
);
INSERT INTO "new_Site" ("site_application_link", "site_directory", "site_domain_1", "site_domain_2", "site_id", "site_proxy_enabled", "site_proxy_port", "site_ssl_crt_file", "site_ssl_enabled", "site_ssl_key_file") SELECT "site_application_link", "site_directory", "site_domain_1", "site_domain_2", "site_id", "site_proxy_enabled", "site_proxy_port", "site_ssl_crt_file", "site_ssl_enabled", "site_ssl_key_file" FROM "Site";
DROP TABLE "Site";
ALTER TABLE "new_Site" RENAME TO "Site";
CREATE UNIQUE INDEX "Site_site_domain_1_key" ON "Site"("site_domain_1");
CREATE UNIQUE INDEX "Site_site_domain_2_key" ON "Site"("site_domain_2");
PRAGMA foreign_key_check("Site");
PRAGMA foreign_keys=ON;
