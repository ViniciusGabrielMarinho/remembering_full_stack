'use client';

import React from 'react';
import { IMonster, IMonsterAttributes } from '../Interfaces/monsters';
import { formatSpeed } from "../components/FormatSpeed";



const AttributesBlock: React.FC<{ attributes: IMonsterAttributes }> = ({ attributes }) => {

    // Lista de atributos na ordem padrão de D&D
    const attrList = ['str', 'dex', 'con', 'int', 'wis', 'cha'] as const;

    // Calcula o modificador (Ex: 10/11 = +0, 12/13 = +1)
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
            backgroundColor: '#EDE0D4', // Fundo mais claro para destaque
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

// --- Componente Principal: MonsterCard ---
export default function MonsterCard({ monster }: { monster: IMonster }) {

  const cardStyle: React.CSSProperties = {
    border: '2px solid #5C0000',
    borderRadius: '8px',
    padding: '15px',
    backgroundColor: '#FAF0E6', // Cor de pergaminho
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    fontFamily: 'serif',
    minHeight: '200px',
    // Adicione a opção de click/seleção aqui no futuro: cursor: 'pointer',
  };

  // Estilo para os títulos das estatísticas (AC, HP, etc.)
  const statStyle: React.CSSProperties = {
      display: 'block',
      fontWeight: 'bold',
      color: '#5C0000',
      marginBottom: '5px'
  };

  return (
    <div
      style={cardStyle}
      role="region"
      aria-label={`Stat Block for ${monster.name}`}
    >
      {/* NOME E CR */}
      <h3 style={{
        textAlign: 'center',
        color: '#5C0000',
        margin: '0 0 10px 0',
        textTransform: 'uppercase'
      }}>
        {monster.name}
      </h3>
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          **CR:** <span style={{ fontWeight: 'bold', color: '#005C00', fontSize: '1.2em' }}>{monster.cr ?? '?'}</span>
      </div>
      <hr style={{ borderColor: '#5C0000', margin: '5px 0' }} />

      {/* INFORMAÇÕES BÁSICAS */}
      <p style={{ margin: '5px 0' }}>
        <span style={statStyle}>Type:</span> {monster.type ?? 'Unknown'}
      </p>
      <p style={{ margin: '5px 0' }}>
        <span style={statStyle}>AC:</span> {monster.ac}
      </p>
      <p style={{ margin: '5px 0' }}>
        <span style={statStyle}>HP:</span> {monster.hp}
      </p>
      <p style={{ margin: '5px 0' }}>
        <span style={statStyle}>Speed:</span> {formatSpeed(monster.speed)}
      </p>

      {/* BLOCO DE ATRIBUTOS (STR, DEX, etc.) */}
      {/* Garantimos que 'attributes' existe antes de passar, se necessário */}
      {monster.attributes && <AttributesBlock attributes={monster.attributes} />}

      {/* AÇÕES (Exibe o nome da primeira ação) */}
      {monster.actions && monster.actions.length > 0 && (
          <div style={{ marginTop: '10px', borderTop: '1px dotted #5C0000', paddingTop: '5px', fontSize: '0.9em' }}>
              <span style={statStyle}>Actions:</span>
              {monster.actions.map(a => a.name).join(', ')}
          </div>
      )}

    </div>
  );
}