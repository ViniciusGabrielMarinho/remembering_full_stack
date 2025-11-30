"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface SavedCard {
  id: number;
  name: string;
  image: string;
}


interface SavedCardsContextType {
  saved: SavedCard[];
  saveCard: (card: SavedCard) => void;
  removeCard: (id: number) => void;
}

const SavedCardsContext = createContext<SavedCardsContextType | undefined>(
  undefined
);

export function SavedCardsProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<SavedCard[]>([]);

  function saveCard(card: SavedCard) {
    setSaved((prev) => {
      if (prev.find((c) => c.id === card.id)) return prev; // evitar duplicados
      return [...prev, card];
    });
  }

  function removeCard(id: number) {
    setSaved((prev) => prev.filter((card) => card.id !== id));
  }

  return (
    <SavedCardsContext.Provider value={{ saved, saveCard, removeCard }}>
      {children}
    </SavedCardsContext.Provider>
  );
}

export function useSavedCards() {
  const ctx = useContext(SavedCardsContext);
  if (!ctx) {
    throw new Error("useSavedCards must be used inside SavedCardsProvider");
  }
  return ctx;
}
