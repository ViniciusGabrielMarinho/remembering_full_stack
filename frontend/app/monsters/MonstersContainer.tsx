'use client';
import React, {useState, useEffect, useCallback} from 'react';
import MonstersList from './MonstersList';


interface MonsterQuery {
  page: number;
  limit: number;
  search: string;
  type?: string;
}

const initialQuery : MonstersQuery = {
  page : 1,
  limit : 50,
  search : '',
}

export default function MontersContainer(){
    const [query, setQuery] = useState<MonsterQuery>(initialQuery);
    const [monstersData, setMontersData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const  updateQuery = useCallback((updates: Partial<MonsterQuery>) =>{
        setQuery (prev =>{
            const IsFilterChange = Object.keys(updates).some(key => key !== 'page' && key !== 'limit')

    return{
    ...prev,
    ...updates,
    page: IsFilterChange ? 1 : updates.page ?? prev.page,
  }
  })
}, [])

    const handleSearchChange =  (e: React.ChangeEvent<HTMLInputElement>) =>{
        updateQuery({ search: e.target.value});
    }

    useEffect(() =>{
        const fetchMonsters =  async () =>{
            setLoading(true);
            const params =  new URLSearchParams()

            if (query.search) params.append('search', query.search);
            if (query.type) params.append('type', query.type);
            params.append('page', String(query.page))
            params.append('limit', String(query.limit))

            try {
                const url =  `http://localhost:8080/monsters?${params.toString()}`
                const res = await fetch(url, {cache: "no-store"})
                const data =await res.json()
                setMonstersData(data)
            } catch(e){
                console.error("Erro ao buscar monstros:", e)
            } finally {
                serLoafing(false)
            }
        }

        ferchMonters()
     }, [query])

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
            {monstersData && monstersData.data && <MonstersList monsters = {monstersData.data}/>}
        </div>
     )

}

