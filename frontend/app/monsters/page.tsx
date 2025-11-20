import MonstersList from "./MonstersList";

export default async function MonstersPage() {
  const page = 1
  const limit = 50
  const res = await fetch(`http://localhost:8080/monsters?page${page}&limit${limit}`, {
    cache: "no-store",
  });

  const monsters = await res.json();

  return (
    <main style={{ padding: "20px" }}>
      <h1>Lista de Monstros</h1>

      <MonstersList monsters={monsters} />
    </main>
  );
}
