import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  const bestiaryPath = path.join(process.cwd(), 'data/bestiary');

  // ler todos arquivos que começam com "bestiary-" e terminam com ".json"
  const files = fs.readdirSync(bestiaryPath)
    .filter(f => f.startsWith('bestiary-') && f.endsWith('.json'));

  console.log(`Arquivos encontrados: ${files.length}`);

  let monsters: any[] = [];

  for (const file of files) {
    const fullPath = path.join(bestiaryPath, file);
    const json = JSON.parse(fs.readFileSync(fullPath, 'utf8'));

    if (json.monster && Array.isArray(json.monster)) {
      monsters.push(...json.monster);
    }
  }

  console.log(`Total de monstros encontrados: ${monsters.length}`);

  for (const m of monsters) {
    await prisma.monster.create({
      data: {
        name: m.name,
        source: m.source ?? "",
        hp: m.hp?.average ?? 0,
        ac: typeof m.ac?.[0] === "number" ? m.ac[0] : m.ac?.[0]?.ac ?? 0,
        str: m.str ?? 0,
        dex: m.dex ?? 0,
        con: m.con ?? 0,
        int: m.int ?? 0,
        wis: m.wis ?? 0,
        cha: m.cha ?? 0,

       cr: typeof m.cr === "string"
  ? m.cr
  : (typeof m.cr === "object" && m.cr?.cr)
    ? m.cr.cr
    : "0",

      }
    });
  }


  console.log('Importação concluída!');
}

main()
  .then(() => prisma.$disconnect())
  .catch(err => {
    console.error(err);
    prisma.$disconnect();
  });
