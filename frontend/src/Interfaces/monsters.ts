export interface IMonsterAttributes {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

export interface IMonsterFeature {
  name: string;
  desc: string;
}

export interface IMonsterSpeed {
  walk?: string;
  fly?: string;
  swim?: string;
  burrow?: string;
  climb?: string;
  [key: string]: string | undefined; // garante extensibilidade
}

export interface IMonster {
  id: string;
  name: string;
  cr: string | number | null;
  type: string | null;

  hp: number;
  ac: number;

  speed: IMonsterSpeed; // <── AGORA CORRETO!

  attributes: IMonsterAttributes;

  traits: IMonsterFeature[];
  senses: string;

  actions: IMonsterFeature[];
  bonusActions: IMonsterFeature[];
  legendaryActions: IMonsterFeature[];
}

export interface IMonstersAPIResponse {
  data: IMonster[];
  total: number;
  limit: number;
  page: number;
  totalPages?: number; // opcional mas útil
}
