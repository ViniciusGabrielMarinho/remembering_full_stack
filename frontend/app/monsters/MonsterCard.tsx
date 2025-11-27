'use client';

import { IMonster } from '../../src/Interfaces/monsters';

interface MonsterCardProps {
    monster: IMonster;
}

export default function MonsterCard({ monster }: MonsterCardProps) {
    const {
        name,
        type,
        cr,
        hp,
        ac,
        speed,
        attributes,
        actions,
        traits,
    } = monster;

    const speedText = Object.entries(speed)
      .map(([k, v]) => {
          if (typeof v === "string") return `${k}: ${v}`;
          if (typeof v === "number") return `${k}: ${v} ft.`;

          if (v && typeof v === "object") {
              const obj = v as Record<string, any>;
              const num = obj.number ?? obj.value ?? null;
              const cond = obj.condition ? ` ${obj.condition}` : "";
              if (num !== null) return `${k}: ${num} ft.${cond}`;
          }

          return `${k}: ?`;
      })
      .join(", ");

    return (
        <div
            style={{
                border: '1px solid #555',
                borderRadius: '10px',
                padding: '15px',
                background: '#1c1c1c',
                color: 'white',
            }}
        >
            <h2>{name}</h2>

            <p><strong>Tipo:</strong> {type}</p>
            <p><strong>CR:</strong> {cr}</p>

            <p><strong>HP:</strong> {hp}</p>
            <p><strong>AC:</strong> {ac}</p>

            <p><strong>Velocidade:</strong> {speedText}</p>

            <h3>Atributos</h3>
            <ul>
                {Object.entries(attributes).map(([attr, value]) => (
                    <li key={attr}>{attr.toUpperCase()}: {value}</li>
                ))}
            </ul>

            {!!traits.length && (
                <>
                    <h3>Traços</h3>
                    {traits.map(t => (
                        <p key={t.name}><strong>{t.name}:</strong> {t.desc}</p>
                    ))}
                </>
            )}

            {!!actions.length && (
                <>
                    <h3>Ações</h3>
                    {actions.map(a => (
                        <p key={a.name}><strong>{a.name}:</strong> {a.desc}</p>
                    ))}
                </>
            )}
        </div>
    );
}
