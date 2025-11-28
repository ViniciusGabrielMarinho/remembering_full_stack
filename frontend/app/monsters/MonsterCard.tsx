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
        speed = {},
        attributes = {},
        actions = [],
        traits = [],
    } = monster;

    // ---- SAFE SPEED FORMATTER ----
    const speedText = Object.entries(speed)
        .map(([k, v]) => {
            if (typeof v === 'string') return `${k}: ${v}`;
            if (typeof v === 'number') return `${k}: ${v} ft.`;

            if (v && typeof v === 'object') {
                const obj = v as Record<string, any>;
                const num = obj.number ?? obj.value ?? null;
                const cond = obj.condition ? ` ${obj.condition}` : '';
                if (num !== null) return `${k}: ${num} ft.${cond}`;
            }

            return `${k}: ?`;
        })
        .join(', ');

    return (
        <div
            style={{
                border: '1px solid #333',
                borderRadius: '12px',
                padding: '18px',
                background: '#101014',
                color: '#f1f1f1',
                boxShadow: '0 0 10px #000',
            }}
        >
            {/* NOME */}
            <h2 style={{ marginBottom: '10px', fontSize: '1.4rem' }}>{name}</h2>

            <p><strong>Tipo:</strong> {type}</p>
            <p><strong>CR:</strong> {cr}</p>

            <p><strong>HP:</strong> {hp}</p>
            <p><strong>AC:</strong> {ac}</p>

            <p><strong>Velocidade:</strong> {speedText}</p>

            {/* ATRIBUTOS */}
            {Object.keys(attributes).length > 0 && (
                <>
                    <h3 style={{ marginTop: '12px' }}>Atributos</h3>
                    <ul>
                        {Object.entries(attributes).map(([attr, value]) => (
                            <li key={attr}>{attr.toUpperCase()}: {value}</li>
                        ))}
                    </ul>
                </>
            )}

            {/* TRAITS */}
            {traits.length > 0 && (
                <>
                    <h3 style={{ marginTop: '12px' }}>Traços</h3>
                    {traits.map(t => (
                        <p key={t.name}>
                            <strong>{t.name}:</strong> {t.desc}
                        </p>
                    ))}
                </>
            )}

            {/* ACTIONS */}
            {actions.length > 0 && (
