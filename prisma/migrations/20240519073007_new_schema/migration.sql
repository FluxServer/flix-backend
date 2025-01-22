-- AlterTable
ALTER TABLE "Application" ADD COLUMN "application_owned_by" INTEGER DEFAULT 1;

-- AlterTable
ALTER TABLE "Site" ADD COLUMN "site_owned_by" INTEGER DEFAULT 1;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "user_type" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_User" ("displayName", "id", "password", "token", "username") SELECT "displayName", "id", "password", "token", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
PRAGMA foreign_key_check("User");
PRAGMA foreign_keys=ON;
