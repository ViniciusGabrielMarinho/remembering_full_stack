import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

/***************************************************
 * TIPOS
 ***************************************************/
interface HpObject {
  average?: number;
  formula?: string;
  special?: string;
}

interface AcEntry {
  ac: number;
}

type BestiaryAc = number | AcEntry | (number | AcEntry)[];

interface BestiaryTypeObject {
  type?: string;
  tags?: string[];
  choose?: string[];
}

type BestiaryType = string | BestiaryTypeObject;

interface BestiarySpeedObject {
  number?: number;
  condition?: string;
  [key: string]: any;
}

type BestiarySpeed =
  | Record<string, number | BestiarySpeedObject | string>
  | Array<Record<string, any>>
  | undefined;

interface BestiaryMonster {
  name: string;
  source?: string;

  hp?: number | HpObject;

  ac?: BestiaryAc;

  str?: number;
  dex?: number;
  con?: number;
  int?: number;
  wis?: number;
  cha?: number;

  cr?: number | string;
  type?: BestiaryType;

  speed?: BestiarySpeed;
}

/***************************************************
 * CLEANER — REMOVE ASPAS E CARACTERES BUGADOS
 ***************************************************/
function cleanNameForDb(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/"/g, "")               // remove aspas duplas
    .replace(/'/g, "")               // remove aspas simples
    .replace(/\(/g, "")              // remove parenteses
    .replace(/\)/g, "")
    .replace(/[^a-zA-Z0-9 -]/g, "")  // remove caracteres estranhos
    .trim();
}

/***************************************************
 * NORMALIZADORES
 ***************************************************/
function normalizeHp(hp: BestiaryMonster["hp"]): number {
  if (!hp) return 1;

  if (typeof hp === "number") return hp;

  if (typeof hp === "object") {
    if (typeof hp.average === "number") return hp.average;

    if (hp.formula) {
      const match = hp.formula.match(/(\d+)/);
      if (match) return Number(match[1]);
    }
  }

  return 1;
}

function normalizeAc(ac: BestiaryMonster["ac"]): number {
  if (!ac) return 10;

  if (typeof ac === "number") return ac;

  if (Array.isArray(ac)) {
    for (const entry of ac) {
      if (typeof entry === "number") return entry;
      if (typeof entry === "object" && typeof entry.ac === "number") {
        return entry.ac;
      }
    }
    return 10;
  }

  if (
    typeof ac === "object" &&
    "ac" in ac &&
    typeof (ac as AcEntry).ac === "number"
  ) {
    return (ac as AcEntry).ac;
  }

  return 10;
}

function normalizeType(type: BestiaryType | { choose?: string[] }): string {
  if (!type) return "Unknown";

  if (typeof type === "string") return type;

  if ("type" in type) {
    const base = type.type ?? "Unknown";
    if (Array.isArray(type.tags) && type.tags.length > 0) {
      return `${base} (${type.tags.join(", ")})`;
    }
    return base;
  }

  if ("choose" in type && Array.isArray(type.choose)) {
    return type.choose.join(" | ");
  }

  return "Unknown";
}

function normalizeSpeed(speed: BestiarySpeed): Record<string, any> {
  if (!speed) return {};

  const result: Record<string, any> = {};

  if (Array.isArray(speed)) {
    for (const entry of speed) {
      if (entry) Object.assign(result, entry);
    }
    return result;
  }

  if (typeof speed === "object") {
    Object.assign(result, speed);
    return result;
  }

  return {};
}

/***************************************************
 * VALIDADOR DE MONSTRO
 ***************************************************/
function isValidMonster(m: BestiaryMonster): boolean {
  if (!m.name) return false;

  const stats = [m.str, m.dex, m.con, m.int, m.wis, m.cha];
  if (stats.some((n) => typeof n !== "number")) return false;

  if (!m.hp) return false;

  return true;
}

/***************************************************
 * IMPORTAÇÃO
 ***************************************************/
async function importMonsters() {
  console.log("📥 Iniciando importação...");

  const dir = path.join(__dirname, "..", "data", "bestiary");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));

  let total = 0;

  for (const file of files) {
    console.log(`📘 Lendo: ${file}`);

    const data = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
    const monsters: BestiaryMonster[] = data.monster ?? data.monsters ?? [];

    for (const m of monsters) {
      if (!isValidMonster(m)) {
        console.log(`⚠ Pulando monstro inválido: ${m.name}`);
        continue;
      }

      const cleanName = cleanNameForDb(m.name);
      const cleanSource = cleanNameForDb(m.source ?? "Unknown");

      try {
        await prisma.monster.create({
          data: {
            name: cleanName,
            source: cleanSource,

            hp: normalizeHp(m.hp),
            ac: normalizeAc(m.ac),

            str: m.str!,
            dex: m.dex!,
            con: m.con!,
            int: m.int!,
            wis: m.wis!,
            cha: m.cha!,

            cr: String(m.cr ?? "0"),
            type: normalizeType(m.type ?? "Unknown"),
            speed: normalizeSpeed(m.speed),
          },
        });

        console.log(`✔ Importado: ${cleanName}`);
        total++;
      } catch (err) {
        console.log(`❌ Erro ao importar: ${cleanName}`);
        console.error(err);
      }
    }
  }

  console.log(`\n🎉 Concluído! Total importado: ${total}`);
}

importMonsters()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
