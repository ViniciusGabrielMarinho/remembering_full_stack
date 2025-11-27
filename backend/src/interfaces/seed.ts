interface ISpeed {
  walk?: number;
  climb?: number;
  fly?: number | { number: number; condition: string };
  canHover?: boolean;
}

interface IType {
  type: string;
  tags?: string[];
}

export interface IMonsterSource {
  name: string;
  source: string;
  hp: { average: number; formula: string } | number;
  ac: (
    number |
    { ac: number; from?: string[]; condition?: string }
  )[];
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
  cr: string | { cr: string };
  type: string | IType;
  speed?: ISpeed;
  [key: string]: any;
}
