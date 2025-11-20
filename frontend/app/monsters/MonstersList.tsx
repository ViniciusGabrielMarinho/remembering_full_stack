"use client";

import { useState } from "react";

export default function MonstersList({ monsters }: { monsters: any[] }) {
  const [search, setSearch] = useState("");

  const filtered = monsters.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <input
        placeholder="Buscar monstro..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "8px",
          marginBottom: "20px",
          width: "250px",
          fontSize: "16px",
        }}
      />

      <ul>
        {filtered.map((m) => (
          <li key={m.id}>
            {m.name} — CR {m.cr ?? "?"}
          </li>
        ))}
      </ul>
    </div>
  );
}
