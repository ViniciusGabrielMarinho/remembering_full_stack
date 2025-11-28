'use client';

import { IMonster } from '../../src/Interfaces/monsters';

interface MonsterCardProps {
    monster: IMonster;
}

/** 
 * Normaliza nomes para URLs do 5e.tools 
 * Remove aspas, símbolos, parênteses, acentos e caracteres inválidos
 */
function cleanName(name: string): string {
    return name
        .normalize("NFD")                   // remove acentos
        .replace(/[\u0300-\u036f]/g, "")    // remove marcas unicode
        .replace(/"/g, "")                  // remove aspas
        .replace(/'/g, "")                  // remove apostrofos
        .replace(/\(/g, "")                 // remove (
        .replace(/\)/g, "")                 // remove )
        .replace(/[^a-zA-Z0-9 -]/g, "")     // remove qualquer símbolo estranho
        .trim();
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

    // 🔥 Limpeza do nome e da source
    const cleanedName = cleanName(name);
    const cleanedSource = cleanName(monster.source ?? "");

    // 🔥 URL completamente segura
    const tokenUrl = `https://5e.tools/img/bestiary/tokens/${encodeURIComponent(cleanedSource)}/${encodeURIComponent(cleanedName)}.webp`;

    // Fallback caso a imagem não exista
    const onImageError = (e: any) => {
        e.target.src = "/fallback-monster.png"; 
    };

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

            {/* IMAGEM */}
            <img
                src={tokenUrl}
                alt={name}
                style={{
                    width: "100%",
                    height: 200,
                    objectFit: "contain",
                    marginBottom: "12px",
                }}
                onError={onImageError}
            />

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
                <>
                    <h3 style={{ marginTop: '12px' }}>Ações</h3>
                    {actions.map((a) => (
                        <p key={a.name}>
                            <strong>{a.name}:</strong> {a.desc}
                        </p>
                    ))}
                </>
            )}
        </div>
    );
}
