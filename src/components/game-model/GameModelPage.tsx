"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import GameHeader from "./GameHeader";
import NumerologyStrip from "./NumerologyStrip";
import GematriaCard from "./GematriaCard";
import AIInsights from "./AIInsights";
import PlayerAccordion from "./PlayerAccordion";

import { buildMasterData } from "../../lib/transformers/buildMasterData";
import { runDailyEngine } from "../../engine/runDailyEngine";
import type { MasterGameData } from "../../types/master";
import { computeGematria } from "../../engine/gematria";
import type { GameModelPlayer } from "./types";
// ---------------------------------------------
// LOCAL PAGE TYPES
// ---------------------------------------------
type EngineSignal = {
  id: string;
  hit: boolean;
};

type EnginePlayerContext = {
  playerId: number;
  name: string;
  team: string;
  opponent: string;
  gameId: number;
  signals: EngineSignal[];
  hits: number;
  score: number;
  reasons: string[];
  headshot: string;
};

type EngineGame = {
  id: string;
  gameId: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamName: string;
  awayTeamName: string;
  date: string;
  totalSignals: number;
  activePlayers: number;
  syncScore: number;
};

type EngineNumbers = {
  dom: number;
  row1_fullSum: number;
  row2_mixedYearDigits: number;
  row3_fullDigits: number;
  row4_shortYear: number;
  row5_shortDigits: number;
  dayOfYear: number;
  daysRemaining: number;
  allComponents: number[];
  uniqueComponents: number[];
  coreNumbers: number[];
  primeComponents: number[];
  masterCandidates: number[];
};

type PageState = {
  date: string;
  game: EngineGame;
  masterGame: MasterGameData;
  numbers: EngineNumbers;
  players: EnginePlayerContext[];
};

// ---------------------------------------------
// HELPERS
// ---------------------------------------------
function getTodayPST(): string {
  const now = new Date();
  const pst = new Date(
    now.toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
    })
  );

  const year = pst.getFullYear();
  const month = String(pst.getMonth() + 1).padStart(2, "0");
  const day = String(pst.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatTipoff(rawDate: string) {
  const date = new Date(rawDate);

  return date.toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function humanizeReason(reason: string) {
  return reason.replaceAll("_", " ");
}

function buildNumerologyItems(numbers: EngineNumbers) {
  return [
    { key: "dom", label: "DOM", value: numbers.dom },
    { key: "full", label: "FULL", value: numbers.row1_fullSum },
    { key: "mixed", label: "MIXED", value: numbers.row2_mixedYearDigits },
    { key: "digits", label: "DIGITS", value: numbers.row3_fullDigits },
    { key: "short", label: "SHORT", value: numbers.row4_shortYear },
    { key: "short_digits", label: "SHORT DIGITS", value: numbers.row5_shortDigits },
  ];
}

function buildGematriaValues(
  game: EngineGame,
  masterGame: MasterGameData
) {
  const homeName = masterGame.homeTeam.displayName;
  const awayName = masterGame.awayTeam.displayName;

  const homeGem = computeGematria(homeName);
  const awayGem = computeGematria(awayName);

  return [
    {
      label: homeName,
      value: homeGem.value,
      match: false,
    },
    {
      label: awayName,
      value: awayGem.value,
      match: false,
    },
  ];
}

function numbersSafe(
  _masterGame: MasterGameData,
  _key: string
): number | null {
  return null;
}

function buildAIInsights(
  game: EngineGame,
  masterGame: MasterGameData,
  players: EnginePlayerContext[]
) {
  if (!players || players.length === 0) return [];

  const sorted = [...players].sort((a, b) => b.score - a.score);

  const top = sorted[0];
  const value = sorted.find((p) => p !== top && p.score >= 2);
  const hidden = sorted.find((p) => p !== top && p !== value && p.score >= 1);

  const insights = [];

  // -------------------------
  // TOP PLAY
  // -------------------------
  if (top) {
    insights.push({
      type: "top",
      player: top.name,
      detail: `${top.hits} signals including ${top.reasons.slice(0, 2).join(", ")}`,
    });
  }

  // -------------------------
  // VALUE PLAY
  // -------------------------
  if (value) {
    insights.push({
      type: "value",
      player: value.name,
      detail: `${value.hits} signal alignment — strong relative value`,
    });
  }

  // -------------------------
  // HIDDEN GEM
  // -------------------------
  if (hidden) {
    insights.push({
      type: "hidden",
      player: hidden.name,
      detail: `Low-profile alignment with ${hidden.hits} signals`,
    });
  }

  return insights;
}

function buildAccordionPlayers(
  players: EnginePlayerContext[],
  masterGame: MasterGameData
): GameModelPlayer[] {
  const playerMap = new Map(
    masterGame.players.map((p) => [String(p.id), p])
  );

  return [...players]
    .sort((a, b) => b.hits - a.hits)
    .map((player) => {
      const source =
        playerMap.get(String(player.playerId)) ||
        masterGame.players.find(
          (p) =>
            p.fullName?.toLowerCase() === player.name?.toLowerCase()
        );
      const rawSignals = player.signals || [];
      const rawReasons = player.reasons || [];

      const syncPercent =
        rawSignals.length > 0
          ? Math.round((player.hits / rawSignals.length) * 100)
          : 0;

      const tags =
        rawReasons.length > 0
          ? rawReasons.map((r) => r.replaceAll("_", " "))
          : ["no signals"];

      const breakdown = rawSignals
        .filter((s) => s.hit)
        .map((s) => s.id.replaceAll("_", " "));

      return {
        id: player.playerId,
        name: player.name,

        teamAbbr: player.team,
        teamName: source?.teamAbbr || player.team,
        opponent: player.opponent,

        headshot: player.headshot || source?.headshot || "",
        jersey: source?.jersey || "",

        // -------------------------
        // CORE SIGNAL DATA
        // -------------------------
        syncPercent,
        hits: player.hits,
        signals: rawSignals,

        tags,
        breakdown,

        // -------------------------
        // CONTEXT
        // -------------------------
        position: source?.position?.abbreviation || "",
        trend: source?.trend || "neutral",
        status: source?.status?.type || "",

        age: source?.age || 0,
        experienceYears: source?.experienceYears || 0,

        last5: source?.last5,
        last10: source?.last10,
        seasonAvg: source?.seasonAvg,
      };
    });
}

// ---------------------------------------------
// PAGE
// ---------------------------------------------
export default function GameModelPage() {
  const searchParams = useSearchParams();
  const gameId = searchParams.get("gameId");

  const [data, setData] = useState<PageState | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setError("");

        const date = getTodayPST();
        const masterGames = await buildMasterData(date);
        const engine = await runDailyEngine(masterGames, date);

        const selectedGame = engine.games.find(
          (g: EngineGame) => String(g.gameId) === String(gameId)
        ) as EngineGame | undefined;

        const selectedMasterGame = masterGames.find(
          (g) => String(g.gameId) === String(gameId)
        );

        if (!mounted) return;

        if (!gameId) {
          setError("No game selected.");
          return;
        }

        if (!selectedGame || !selectedMasterGame) {
          setError("Selected game could not be found.");
          return;
        }

        const gamePlayers = (engine.playerContexts as EnginePlayerContext[]).filter(
          (p) => String(p.gameId) === String(gameId)
        );

        const pageState: PageState = {
          date,
          game: selectedGame,
          masterGame: selectedMasterGame,
          numbers: engine.numbers as EngineNumbers,
          players: gamePlayers,
        };

        setData(pageState);

        if (gamePlayers.length > 0) {
          const topPlayer = [...gamePlayers].sort((a, b) => b.score - a.score)[0];
          setExpandedId(topPlayer?.playerId ?? null);
        }
      } catch (err) {
        if (!mounted) return;
        console.error("[GameModelPage] load failed", err);
        setError("Failed to load game model.");
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [gameId]);

  const selectedPlayers = useMemo(() => {
    if (!data) return [];
    return buildAccordionPlayers(data.players, data.masterGame).filter((p: any) =>
      selectedIds.includes(p.id)
    );
  }, [data, selectedIds]);

  const buildConfidence = useMemo(() => {
    if (!selectedPlayers.length) return 0;

    const avg =
      selectedPlayers.reduce((sum: number, p: any) => sum + p.syncPercent, 0) /
      selectedPlayers.length;

    return Math.round(Math.min(99, avg));
  }, [selectedPlayers]);

  const handleToggleAdd = (player: any) => {
    setSelectedIds((prev) =>
      prev.includes(player.id)
        ? prev.filter((id) => id !== player.id)
        : [...prev, player.id]
    );
  };

  if (error) {
    return (
      <div className="flex h-[100dvh] items-center justify-center text-white">
        <div className="surface-glass rounded-[var(--radius-lg)] px-5 py-3 text-sm text-white/70">
          {error}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-[100dvh] items-center justify-center text-white">
        <div className="surface-glass rounded-[var(--radius-lg)] px-5 py-3 text-sm text-white/70">
          Loading game model...
        </div>
      </div>
    );
  }

  const numerologyItems: any = buildNumerologyItems(data.numbers);
  const gematriaValues: any = buildGematriaValues(data.game, data.masterGame);
  const aiInsights: any = buildAIInsights(data.game, data.masterGame, data.players);
  const accordionPlayers: any = buildAccordionPlayers(data.players, data.masterGame);

  const headerGame = {
    homeTeamName: data.game.homeTeamName,
    awayTeamName: data.game.awayTeamName,
    homeTeamAbbr: data.game.homeTeam,
    awayTeamAbbr: data.game.awayTeam,
    syncScore: data.game.syncScore,
    totalSignals: data.game.totalSignals,
    activePlayers: data.game.activePlayers,
    tipoff: formatTipoff(data.game.date),
    status: data.masterGame.status,
    venue: data.masterGame.venue,
    betting: data.masterGame.betting?.[0] ?? null,
    homeRecord: data.masterGame.homeTeam.record.summary,
    awayRecord: data.masterGame.awayTeam.record.summary,
    buildConfidence,
  };

  return (
    <main className="relative w-full text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-8%] h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute right-[-8%] top-[12%] h-60 w-60 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute bottom-[8%] left-[18%] h-44 w-44 rounded-full bg-orange-400/10 blur-3xl" />
      </div>

      <section className="app-shell section-stack pb-24">
        <GameHeader game={headerGame as any} />

        <NumerologyStrip items={numerologyItems} />

        <div className="flex flex-col gap-4">
          <GematriaCard values={gematriaValues} />
          <AIInsights insights={aiInsights} />
        </div>

        <div className="min-h-0 flex-1">
          <PlayerAccordion
            players={accordionPlayers}
            expandedId={expandedId}
            selectedIds={selectedIds}
            onExpand={(id: number) =>
              setExpandedId((prev) => (prev === id ? null : id))
            }
            onToggleAdd={handleToggleAdd}
          />
        </div>
      </section>
    </main>
  );
}