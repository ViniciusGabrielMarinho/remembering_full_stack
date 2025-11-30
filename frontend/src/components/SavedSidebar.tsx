"use client";
import { useSavedCards } from "./SavedCardsContext";

export default function SavedSidebar() {
  const { saved, removeCard } = useSavedCards();

  return (
    <div className="fixed top-0 left-0 w-48 h-full bg-zinc-900 text-white p-3 overflow-y-auto shadow-lg">
      <h2 className="text-lg mb-3 font-bold">Salvos</h2>

      {saved.length === 0 && (
        <p className="text-sm opacity-60">Nenhuma carta salva</p>
      )}

      {saved.map((c) => (
        <div key={c.id} className="mb-3 flex flex-col">
          <img src={c.img} className="w-full rounded" />
          <span className="text-sm mt-1">{c.name}</span>
          <button
            onClick={() => removeCard(c.id)}
            className="mt-1 text-xs bg-red-600 px-2 py-1 rounded"
          >
            Remover
          </button>
        </div>
      ))}
    </div>
  );
}
