"use client";

import { useState, useEffect } from "react";

// =====================
// ENGINE + DATA
// =====================
import { buildMasterData } from "../lib/transformers/buildMasterData";
import { runDailyEngine } from "../engine/runDailyEngine";
import { setPlayers } from "../lib/playerStore";
// =====================
// DERIVED LOGIC
// =====================
import { generateInsights } from "../lib/generateInsights";
import { generateNumberInsights } from "../lib/generateNumberInsights";

// =====================
// COMPONENTS
// =====================
import Header from "../components/Header";
import SearchFiltersRow from "../components/search/SearchFiltersRow";
import TopPlayCard from "../components/TopPlayCard";
import MostActiveGame from "../components/MostActiveGame";
import GameStrip from "../components/GameStrip";
import AISignalEngine from "../components/ai/AISignalEngine";
import NumbersOfDayPanel from "../components/numbers/NumbersOfDayPanel";

export default function Page() {
  // =====================
  // DATE STATE (PST DEFAULT)
  // =====================
 const [date, setDate] = useState(() => {
  const now = new Date();

  // PST = UTC-8 (no DST handling for now, but stable)
  const pstOffset = 8 * 60 * 60 * 1000;

  const pstTime = new Date(now.getTime() - pstOffset);

  return pstTime.toISOString().split("T")[0];
});

  // =====================
  // ENGINE DATA STATE
  // =====================
  const [data, setData] = useState<any>(null);

  // =====================
  // LOAD ENGINE ON DATE CHANGE
  // =====================
  useEffect(() => {
    async function load() {
      const masterGames = await buildMasterData(date);
      const result = await runDailyEngine(masterGames, date);

      console.log("ENGINE FULL OUTPUT:", result);

      setData(result);

      // 🔥 immediately populate global player store
      if (result?.playerContexts?.length) {
        setPlayers(result.playerContexts);
      }
    }

    load();
  }, [date]);

  // =====================
  // LOADING STATE
  // =====================
  if (!data) {
    return (
      <div className="text-white p-4">
        Loading...
      </div>
    );
  }

  // =====================
  // SAFE EXTRACTION
  // =====================
  const topPlays = data.topPlays || [];
  const games = data.games || [];
  const mostActiveGame = data.mostActiveGame || null;
  const numbers = data.numbers || {};

  const numberInsights = generateNumberInsights({
    playerContexts: data.playerContexts || [],
    numbers,
  });

  const top = topPlays[0];

  const insights = generateInsights({
    topPlays,
    mostActiveGame,
    games,
    numbers,
  });


  // =====================
  // RENDER
  // =====================
  return (
    <div>
      {/* HEADER (DATE CONTROL) */}
      <Header onDateChange={setDate} />

      <SearchFiltersRow />

      {/* =====================
          TOP PLAY
      ===================== */}
      <div className="mt-2 px-2 text-[10px] tracking-[0.18em] text-white/50 uppercase">
        Top Players Today
      </div>

      <div className="mt-2">
        {top && <TopPlayCard player={top} />}
      </div>

      {/* =====================
          MOST ACTIVE GAME
      ===================== */}
      <div className="mt-4 px-2 text-[10px] tracking-[0.18em] text-white/50 uppercase">
        Most Active Game
      </div>

      <div className="mt-2">
        <MostActiveGame game={mostActiveGame} />
      </div>

      {/* =====================
          GAME STRIP
      ===================== */}
      <div className="mt-4">
        <GameStrip games={games} />
      </div>

      {/* =====================
          AI SIGNAL ENGINE
      ===================== */}
      <div className="mt-4">
        <AISignalEngine insights={insights} games={games} />
      </div>

      {/* =====================
          NUMBERS OF THE DAY
      ===================== */}
      <div className="mt-4">
        <NumbersOfDayPanel data={numberInsights} />
      </div>
    </div>
  );
}