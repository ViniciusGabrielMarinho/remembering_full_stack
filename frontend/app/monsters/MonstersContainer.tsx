'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useDebounce } from 'use-debounce';
import MonstersList from './MonstersList';
import { IMonstersAPIResponse } from '../../src/Interfaces/monsters'

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

    const [debouncedSearch] = useDebounce(query.search, 1);

    const updateQuery = useCallback((updates: Partial<MonsterQuery>) => {
        setQuery(prev => {
            const isFilterChange = Object.keys(updates).some(key => key !== 'page' && key !== 'limit');
            return {
                ...prev,
                ...updates,
                page: isFilterChange ? 1 : updates.page ?? prev.page,
            }
        })
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateQuery({ search: e.target.value });
    }

    useEffect(() => {
        const fetchMonsters = async () => {
            setLoading(true);
            const params = new URLSearchParams()

            if (query.type) params.append('type', query.type);

            if (debouncedSearch) params.append('search', debouncedSearch);
            params.append('page', String(query.page))
            params.append('limit', String(query.limit))

            // if (query.type && query.type !== 'All') params.append('type', query.type)


            try {
                const url = `/api/monsters?${params.toString()}`
                const res = await fetch(url)
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const data = await res.json()
                setMonstersData(data)
            } catch(e){
                console.error("Erro ao buscar monstros:", e)
                setMonstersData({ data: [] });
            } finally {
                setLoading(false)
            }
        }

        fetchMonsters()
    }, [debouncedSearch, query.page, query.limit, query.type])

return (
        <div>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '25px', padding: '10px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                <label htmlFor="monster-type-select" style={{ fontWeight: 'bold' }}>Filtrar por Tipo:</label>
                <select
                    id="monster-type-select"
                    value={query.type ?? 'All'}
                    onChange={(e) => updateQuery({ type: e.target.value === 'All' ? undefined : e.target.value.toLowerCase() })}
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #aaa' }}
                >
                    {MONSTER_TYPES.map(type => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>

                <input
                    type='text'
                    placeholder="Buscar monstro por nome..."
                    value={query.search}
                    onChange={handleSearchChange}
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #aaa', flexGrow: 1 }}
                />
            </div>
            {loading && <p>Carregando monstros...</p>}
            {monstersData && Array.isArray(monstersData.data) && (
                <MonstersList monsters={monstersData.data} />
            )}
            {!loading && monstersData && monstersData.data.length === 0 && (
                <p>Nenhum monstro encontrado com os critérios atuais.</p>
            )}
        </div>
    );
}