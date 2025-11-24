// file: MonstersContainer.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useDebounce } from 'use-debounce';
import MonstersList from './MonstersList';

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
    const [monstersData, setMonstersData] = useState<String>(null); // testando se tirar o "any" e colocar o "st"
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
        console.log("--- USE EFFECT EXECUTADO com Debounce ---");

        const fetchMonsters = async () => {
            setLoading(true);
            const params = new URLSearchParams()
            if (debouncedSearch) params.append('search', debouncedSearch);
            if (query.type) params.append('type', query.type);
            params.append('page', String(query.page))
            params.append('limit', String(query.limit))

            try {
                const url = `/api/monsters?${params.toString()}`
                const res = await fetch(url, {cache: "no-store"})
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
            <input
                type='text'
                placeholder="Buscar monstro por nome..."
                value={query.search}
                onChange={handleSearchChange}
                style={{ padding: '10px', marginBottom: '20px', width: '300px' }}
            />

            {loading && <p> Carregando monstros...</p>}
            {monstersData && monstersData.data && <MonstersList monsters={monstersData.data} />}
        </div>
    );
}