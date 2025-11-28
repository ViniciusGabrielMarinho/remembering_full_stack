import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  const dir = path.join(__dirname, "..", "data", "bestiary");

  const files = fs.readdirSync(dir).filter(f => f.endsWith(".json"));

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const raw = fs.readFileSync(fullPath, "utf8");
    const json = JSON.parse(raw);

    if (!json.monster) continue;

    for (const m of json.monster) {
      await prisma.monster.create({
        data: {
          name: m.name,
          source: m.source ?? null,
          hp: typeof m.hp === "object" ? m.hp.average : m.hp,
          ac: Array.isArray(m.ac) ? m.ac[0] : m.ac,
          str: m.str,
          dex: m.dex,
          con: m.con,
          int: m.int,
          wis: m.wis,
          cha: m.cha,
          cr: typeof m.cr === "object" ? m.cr.cr : m.cr ?? null,
          type: typeof m.type === "object" ? m.type.type : m.type ?? null,
          speed: m.speed ? m.speed : {}
        }
      });
    }
  }

  console.log("Importação completa!");
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => {
    console.error(e);
    prisma.$disconnect();
  });
