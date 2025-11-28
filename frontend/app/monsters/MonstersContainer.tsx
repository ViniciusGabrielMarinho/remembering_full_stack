'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useDebounce } from 'use-debounce';
import MonstersList from './MonstersList';
import { IMonstersAPIResponse } from '../../src/Interfaces/monsters'

const MONSTER_TYPES = [
  'Aberration', 'Beast', 'Construct', 'Elemental', 'Fey',
  'Giant', 'Humanoid', 'Ooze', 'Undead',
];

interface MonsterQuery {
    page: number;
    limit: number;
    search: string;
    types: string[];   // <-- múltiplos tipos selecionados (lowercase)
}

const initialQuery: MonsterQuery = {
    page: 1,
    limit: 50,
    search: '',
    types: [],       // <-- importante: inicializar como array vazio
};

export default function MonstersContainer() {
    const [query, setQuery] = useState<MonsterQuery>(initialQuery);
    const [monstersData, setMonstersData] = useState<IMonstersAPIResponse | null>(null);
    const [loading, setLoading] = useState(false);

    const [debouncedSearch] = useDebounce(query.search, 300);

    const updateQuery = useCallback((updates: Partial<MonsterQuery>) => {
        setQuery(prev => {
            const filterChanged = Object.keys(updates).some(
                key => key !== 'page' && key !== 'limit'
            );

            return {
                ...prev,
                ...updates,
                page: filterChanged ? 1 : updates.page ?? prev.page,
            };
        });
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateQuery({ search: e.target.value });
    };

    // adiciona/remove um tipo no array query.types
    const toggleType = (type: string) => {
        const normalized = type.toLowerCase();
        setQuery(prev => {
            const set = new Set(prev.types || []);
            if (set.has(normalized)) set.delete(normalized);
            else set.add(normalized);
            return { ...prev, types: Array.from(set), page: 1 };
        });
    };

    // limpa todos os tipos (All)
    const clearTypes = () => {
        updateQuery({ types: [] });
    };

    useEffect(() => {
        const fetchMonsters = async () => {
            setLoading(true);

            const params = new URLSearchParams();

                if (query.types.length > 0) {
                    query.types.forEach(t => params.append("types", t));
                    }

                if (debouncedSearch) params.append("search", debouncedSearch);

                    params.append("page", String(query.page));
                    params.append("limit", String(query.limit));

            try {
                const res = await fetch(`/api/monsters?${params.toString()}`);
                if (!res.ok) throw new Error(`HTTP error ${res.status}`);

                const data: IMonstersAPIResponse = await res.json();
                setMonstersData(data);
            } catch (err) {
                console.error(err);
                setMonstersData({
                    data: [],
                    page: 1,
                    total: 0,
                    totalPages: 1
                } as IMonstersAPIResponse);
            } finally {
                setLoading(false);
            }
        };

        fetchMonsters();
    }, [query.page, query.limit, query.types, debouncedSearch]);


    return (
        <div>
            {/* ------- FILTER BAR ------- */}
            <div
                style={{
                    display: "flex",
                    gap: "15px",
                    alignItems: "center",
                    marginBottom: "25px",
                    padding: "12px",
                    border: "1px solid #444",
                    borderRadius: "8px",
                    backgroundColor: "#202020",
                    color: "white",
                    flexWrap: "wrap"
                }}
            >
                <label
                    htmlFor="monster-type-select"
                    style={{ fontWeight: "bold", color: "white", minWidth: 120 }}
                >
                    Filtrar por Tipo:
                </label>

                {/* Checkboxes multi-select */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <button
                        onClick={clearTypes}
                        style={{
                            padding: '6px 10px',
                            borderRadius: 6,
                            border: '1px solid #555',
                            background: query.types.length === 0 ? '#444' : '#2b2b2b',
                            color: 'white',
                            cursor: 'pointer'
                        }}
                    >
                        All
                    </button>

                    {MONSTER_TYPES.map(type => {
                        const lower = type.toLowerCase();
                        const checked = (query.types || []).includes(lower);
                        return (
                            <label key={type} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', color: 'white', padding: '4px 8px', borderRadius: 6, background: checked ? '#3a3a3a' : 'transparent', border: checked ? '1px solid #666' : '1px solid transparent' }}>
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => toggleType(type)}
                                    style={{ width: 14, height: 14, accentColor: '#8b5cf6' }}
                                />
                                {type}
                            </label>
                        );
                    })}
                </div>

                {/* Search */}
                <input
                    type="text"
                    placeholder="Buscar monstro por nome..."
                    value={query.search}
                    onChange={handleSearchChange}
                    style={{
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #555",
                        backgroundColor: "#2b2b2b",
                        color: "white",
                        flexGrow: 1,
                        minWidth: 240
                    }}
                />
            </div>

            {/* LOADING */}
            {loading && <p style={{ color: 'white' }}>Carregando monstros...</p>}

            {/* MONSTER LIST */}
            {monstersData && Array.isArray(monstersData.data) && (
                <>
                    <MonstersList monsters={monstersData.data} />

                    {/* PAGINATION */}
                    <div
                        style={{
                            marginTop: "20px",
                            display: "flex",
                            justifyContent: "center",
                            gap: "15px",
                            color: "white",
                        }}
                    >
                        <button
                            disabled={query.page <= 1}
                            onClick={() => updateQuery({ page: query.page - 1 })}
                            style={{
                                padding: "8px 14px",
                                borderRadius: "6px",
                                border: "1px solid #555",
                                background: "#2b2b2b",
                                color: "white",
                                cursor: query.page <= 1 ? "not-allowed" : "pointer",
                            }}
                        >
                            ← Anterior
                        </button>

                        <span>
                            Página <strong>{query.page}</strong> de{" "}
                            <strong>{monstersData.totalPages ?? 1}</strong>
                        </span>

                        <button
                            disabled={query.page >= (monstersData.totalPages ?? 1)}
                            onClick={() => updateQuery({ page: query.page + 1 })}
                            style={{
                                padding: "8px 14px",
                                borderRadius: "6px",
                                border: "1px solid #555",
                                background: "#2b2b2b",
                                color: "white",
                                cursor:
                                    query.page >= (monstersData.totalPages ?? 1) ? "not-allowed" : "pointer",
                            }}
                        >
                            Próxima →
                        </button>
                    </div>
                </>
            )}

            {/* EMPTY */}
            {!loading && monstersData && monstersData.data.length === 0 && (
                <p style={{ color: 'white' }}>Nenhum monstro encontrado com os critérios atuais.</p>
            )}
        </div>
    );
}
