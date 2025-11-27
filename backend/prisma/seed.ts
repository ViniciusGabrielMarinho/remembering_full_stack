import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

interface MonsterData {
  name: string;
  source?: string;
  ac: number;
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
  cr: string | number;
  type?: string;
  speed?: Record<string, number>;
  hp: number;
}

async function loadMonsterFiles(): Promise<MonsterData[]> {
  const monsters: MonsterData[] = [];
  const dir = path.join(__dirname, "monsters");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));

  for (const file of files) {
    const content = fs.readFileSync(path.join(dir, file), "utf-8");
    const data = JSON.parse(content);

    if (Array.isArray(data)) {
      monsters.push(...data);
    } else {
      monsters.push(data);
    }
  }

  return monsters;
}

async function main() {
  const monsters = await loadMonsterFiles();
  await prisma.monster.deleteMany({});

  for (const m of monsters) {
    if (!m.hp) {
      console.warn(`⚠ Monstro sem HP detectado: ${m.name}`);
      continue; // ou m.hp = 1;
    }

    await prisma.monster.create({
      data: {
        name: m.name,
        source: m.source,
        ac: m.ac,
        str: m.str,
        dex: m.dex,
        con: m.con,
        int: m.int,
        wis: m.wis,
        cha: m.cha,
        cr: String(m.cr),
        type: m.type,
        speed: m.speed as any,
        hp: m.hp, // ✔ agora sempre presente
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
