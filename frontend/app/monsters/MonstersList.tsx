'use client';

import { IMonster } from '../../src/Interfaces/monsters';
import MonsterCard from '../../src/components/MonstersCards';

export default function MonstersList({ monsters }: { monsters: IMonster[] }) {
  if (!monsters?.length) {
    return <p>No monsters found with the current filters.</p>;
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '25px',
        padding: '20px 0',
      }}
    >
      {monsters.map(monster => (
        <MonsterCard key={monster.id} monster={monster} />
      ))}
    </div>
  );
}
