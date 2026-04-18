"use client";

import { create } from "zustand";

// ------------------
// TYPES
// ------------------

export type BuildPlayer = {
  id: number;
  name: string;
  syncPercent: number;
};

type BuildStore = {
  players: BuildPlayer[];

  addPlayer: (player: BuildPlayer) => void;
  removePlayer: (id: number) => void;
  clear: () => void;
};

// ------------------
// STORE
// ------------------

export const useBuildStore = create<BuildStore>((set) => ({
  players: [],

  addPlayer: (player: BuildPlayer) =>
    set((state: BuildStore) => {
      const exists = state.players.some((p) => p.id === player.id);
      if (exists) return state;

      return {
        players: [...state.players, player],
      };
    }),

  removePlayer: (id: number) =>
    set((state: BuildStore) => ({
      players: state.players.filter((p) => p.id !== id),
    })),

  clear: () =>
    set({
      players: [],
    }),
}));