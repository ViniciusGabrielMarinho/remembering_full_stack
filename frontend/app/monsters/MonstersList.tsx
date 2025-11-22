"use client";

export default function MonstersList({ monsters }: { monsters: any[] }) {

    if(!Array.isArray(monsters))
      return null

  return (
    <div>
        <ul>
        {monsters.map((m) => (
          <li key={m.id}>
            {m.name} — CR {m.cr ?? "?"},
          </li>
        ))}
      </ul>
    </div>
  );
}
