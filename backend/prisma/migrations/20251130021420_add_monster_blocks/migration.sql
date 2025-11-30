/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Monster" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "source" TEXT,
    "hp" INTEGER NOT NULL,
    "ac" INTEGER NOT NULL,
    "str" INTEGER NOT NULL,
    "dex" INTEGER NOT NULL,
    "con" INTEGER NOT NULL,
    "int" INTEGER NOT NULL,
    "wis" INTEGER NOT NULL,
    "cha" INTEGER NOT NULL,
    "cr" TEXT,
    "type" TEXT,
    "speed" JSONB,
    "traits" JSONB NOT NULL DEFAULT [],
    "actions" JSONB NOT NULL DEFAULT [],
    "bonusActions" JSONB NOT NULL DEFAULT [],
    "reactions" JSONB NOT NULL DEFAULT [],
    "legendaryActions" JSONB NOT NULL DEFAULT [],
    "mythicActions" JSONB NOT NULL DEFAULT [],
    "lairActions" JSONB NOT NULL DEFAULT [],
    "spellcasting" JSONB NOT NULL DEFAULT []
);
INSERT INTO "new_Monster" ("ac", "cha", "con", "cr", "dex", "hp", "id", "int", "name", "source", "speed", "str", "type", "wis") SELECT "ac", "cha", "con", "cr", "dex", "hp", "id", "int", "name", "source", "speed", "str", "type", "wis" FROM "Monster";
DROP TABLE "Monster";
ALTER TABLE "new_Monster" RENAME TO "Monster";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
