'use client';

import React, { useState } from 'react';
import { IMonster, IMonsterAttributes } from '../Interfaces/monsters';
import { formatSpeed } from "../components/FormatSpeed";
import Image from "next/image";

// ------------------------------
// Função global para gerar URL da imagem
// ------------------------------
const getMonsterImage = (monster: IMonster) => {
  const name = monster.name.replace(/\s+/g, "%20");
  return `https://5e.tools/img/bestiary/tokens/${monster.source}/${name}.webp`;
};

// ------------------------------
// Bloco de atributos (STR, DEX, etc.)
// ------------------------------
const AttributesBlock: React.FC<{ attributes: IMonsterAttributes }> = ({ attributes }) => {

  const attrList = ['str', 'dex', 'con', 'int', 'wis', 'cha'] as const;

  const getModifier = (score: number): string => {
    const mod = Math.floor((score - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.9em',
      marginTop: '10px',
      backgroundColor: '#EDE0D4',
      padding: '5px',
      borderRadius: '4px'
    }}>
      {attrList.map(attr => (
        <div key={attr} style={{ textAlign: 'center', lineHeight: '1.2' }}>
          <strong style={{ textTransform: 'uppercase' }}>{attr}</strong>
          <div style={{ fontWeight: 'bold' }}>{attributes[attr]}</div>
          <div style={{ fontSize: '0.8em', color: '#5C0000' }}>({getModifier(attributes[attr])})</div>
        </div>
      ))}
    </div>
  );
};

// ------------------------------
// MonsterCard
// ------------------------------
export default function MonsterCard({ monster }: { monster: IMonster }) {

  const [imgSrc, setImgSrc] = useState(getMonsterImage(monster));

  const cardStyle: React.CSSProperties = {
    border: '2px solid #5C0000',
    borderRadius: '8px',
    padding: '15px',
    backgroundColor: '#FAF0E6',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    fontFamily: 'serif',
    minHeight: '200px',
  };

  const statStyle: React.CSSProperties = {
    display: 'block',
    fontWeight: 'bold',
    color: '#5C0000',
    marginBottom: '5px'
  };

  return (
    <div style={cardStyle} role="region" aria-label={`Stat Block for ${monster.name}`}>
      
      <h3 style={{
        textAlign: 'center',
        color: '#5C0000',
        margin: '0 0 10px 0',
        textTransform: 'uppercase'
      }}>
        {monster.name}
      </h3>

      <Image
        src={imgSrc}
        alt={monster.name}
        width={256}
        height={256}
        style={{
          display: "block",
          margin: "0 auto 10px auto",
          borderRadius: "8px",
          border: "2px solid #5C0000",
        }}
        onError={() => setImgSrc("/placeholder.png")}
        unoptimized
      />

      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        **CR:** <span style={{ fontWeight: 'bold', color: '#005C00', fontSize: '1.2em' }}>{monster.cr ?? '?'}</span>
      </div>

      <hr style={{ borderColor: '#5C0000', margin: '5px 0' }} />

      <p><span style={statStyle}>Type:</span> {monster.type ?? 'Unknown'}</p>
      <p><span style={statStyle}>AC:</span> {monster.ac}</p>
      <p><span style={statStyle}>HP:</span> {monster.hp}</p>
      <p><span style={statStyle}>Speed:</span> {formatSpeed(monster.speed)}</p>

      {monster.attributes && <AttributesBlock attributes={monster.attributes} />}

      {monster.actions && monster.actions.length > 0 && (
        <div style={{
          marginTop: '10px',
          borderTop: '1px dotted #5C0000',
          paddingTop: '5px',
          fontSize: '0.9em'
        }}>
          <span style={statStyle}>Actions:</span>
          {monster.actions.map(a => a.name).join(', ')}
        </div>
      )}

    </div>
  );
}
