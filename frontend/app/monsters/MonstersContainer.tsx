'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useDebounce } from 'use-debounce';
import MonstersList from './MonstersList';
import { IMonstersAPIResponse } from '../../src/Interfaces/monsters';

const MONSTER_TYPES = [
  'All',
  'Aberration', 'Beast', 'Construct', 'Elemental', 'Fey',
  'Giant', 'Humanoid', 'Ooze', 'Undead',
];

interface MonsterQuery {
  page: number;
  limit: number;
  search: string;
  type?: string;
}

const initialQuery: MonsterQuery = {
  page: 1,
  limit: 50,
  search: '',
};

export default function MonstersContainer() {
  const [query, setQuery] = useState<MonsterQuery>(initialQuery);
  const [monstersData, setMonstersData] = useState<IMonstersAPIResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const [debouncedSearch] = useDebounce(query.search, 300);

  const updateQuery = useCallback((updates: Partial<MonsterQuery>) => {
    setQuery(prev => {
      const filterChanged = Object.keys(updates).some(key =>
        key !== 'page' && key !== 'limit'
      );

      return {
        ...prev,
        ...updates,
        page: filterChanged ? 1 : (updates.page ?? prev.page),
      };
    });
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateQuery({ search: e.target.value });
  };

  useEffect(() => {
    const fetchMonsters = async () => {
      setLoading(true);

      const params = new URLSearchParams();
      params.append('page', String(query.page));
      params.append('limit', String(query.limit));

      if (query.type) params.append('type', query.type);
      if (debouncedSearch) params.append('search', debouncedSearch);

      try {
        const url = `/api/monsters?${params.toString()}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);
        const data: IMonstersAPIResponse = await res.json();

        setMonstersData(data);
      } catch (error) {
        console.error('Erro ao buscar monstros:', error);
        setMonstersData({
          data: [],
          page: 1,
          limit: query.limit,
          total: 0,
          totalPages: 1,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMonsters();
  }, [debouncedSearch, query.page, query.limit, query.type]);

  const nextPage = () => {
    if (monstersData && query.page < monstersData.totalPages) {
      updateQuery({ page: query.page + 1 });
    }
  };

  const prevPage = () => {
    if (query.page > 1) {
      updateQuery({ page: query.page - 1 });
    }
  };

  return (
    <div>
      {/* FILTROS */}
      <div
        style={{
          display: 'flex',
          gap: '15px',
          alignItems: 'center',
          marginBottom: '25px',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9',
        }}
      >
        <label style={{ fontWeight: 'bold' }}>Tipo:</label>

        <select
          value={query.type ?? 'All'}
          onChange={(e) =>
            updateQuery({
              type: e.target.value === 'All' ? undefined : e.target.value.toLowerCase(),
            })
          }
          style={{ padding: '8px', borderRadius: '4px' }}
        >
          {MONSTER_TYPES.map(t => (
            <option key={t}>{t}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Buscar por nome..."
          value={query.search}
          onChange={handleSearchChange}
          style={{ padding: '8px', flexGrow: 1, borderRadius: '4px' }}
        />
      </div>

      {/* LISTA */}
      {loading && <p>Carregando...</p>}

      {monstersData && (
        <>
          <MonstersList monsters={monstersData.data} />

          {/* PAGINAÇÃO */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              marginTop: '20px',
            }}
          >
            <button
              onClick={prevPage}
              disabled={query.page === 1}
              style={{ padding: '8px 12px' }}
            >
              ◀ Anterior
            </button>

            <span>
              Página {monstersData.page} de {monstersData.totalPages}
            </span>

            <button
              onClick={nextPage}
              disabled={query.page === monstersData.totalPages}
              style={{ padding: '8px 12px' }}
            >
              Próxima ▶
            </button>
          </div>
        </>
      )}
    </div>
  );
}
