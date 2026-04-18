// ======================================================
// RUN DAILY ENGINE (CLEAN, ALIGNED)
// ======================================================

import { MasterGameData } from "../types/master";
import { DateNumerology, computeDateNumerology } from "./dateNumerology";
import { runNBASyncEngine } from "./nbaSyncEngine_v1";

// ======================================================
// ENGINE PLAYER INPUT (STRICT)
// ======================================================

type EnginePlayerInput = {
  id: number;
  name: string;
  jersey: number;
  teamAbbr: string;
  teamName: string;
  dob: string | null;
  opponent: string;
};

// ======================================================
// MAIN RUN FUNCTION
// ======================================================

export async function runDailyEngine(
  games: MasterGameData[],
  date: string
) {
  console.log("[runDailyEngine] INPUT games.length =", games.length);
  console.log(
    "[runDailyEngine] INPUT game ids =",
    games.map((g) => ({
      gameId: g.gameId,
      home: g.homeTeam?.abbreviation,
      away: g.awayTeam?.abbreviation,
      date: g.date,
      players: g.players?.length,
    }))
  );

  const numbers: DateNumerology = computeDateNumerology(date);

  const allPlayerContexts: any[] = [];
  const gameResults: any[] = [];

  for (const game of games) {
    console.log("[runDailyEngine] LOOP START", {
      gameId: game.gameId,
      home: game.homeTeam?.abbreviation,
      away: game.awayTeam?.abbreviation,
      players: game.players?.length,
    });

    const enginePlayers: EnginePlayerInput[] = game.players.map((p) => {
      const isHome = p.teamId === game.homeTeam.id;
      const opponentTeam = isHome ? game.awayTeam : game.homeTeam;

      return {
        id: Number(p.id),
        name: p.fullName,
        jersey: Number(p.jersey || 0),
        teamAbbr: p.teamAbbr,
        teamName: isHome
          ? game.homeTeam.displayName
          : game.awayTeam.displayName,
        dob: p.dateOfBirth || null,
        opponent: opponentTeam.abbreviation,
      };
    });

    const engineResults = runNBASyncEngine(enginePlayers, numbers, date);

const contexts = engineResults.map((res) => {
  const sourcePlayer = game.players.find(
    (p) => String(p.id) === String(res.id)
  );

  const hits = res.signals.filter((s) => s.hit).length;

  return {
    // ======================
    // EXISTING SYSTEM (DO NOT TOUCH)
    // ======================
    playerId: res.id,
    name: res.name,
    team: res.teamAbbr,
    opponent: res.opponent,
    gameId: Number(game.gameId),
    signals: res.signals,
    hits,
    score: hits,
    reasons: res.signals.filter((s) => s.hit).map((s) => s.id),
    headshot: sourcePlayer?.headshot || "",

    // ======================
    // NEW FIELDS (SAFE ADD)
    // ======================
    id: Number(res.id), // future-proof

    sync: Math.round((hits / 11) * 100),

    age: sourcePlayer?.age,

    height: sourcePlayer?.height
      ? `${Math.floor(sourcePlayer.height / 12)}'${sourcePlayer.height % 12}"`
      : undefined,

    position: sourcePlayer?.position?.abbreviation,

    college: sourcePlayer?.college?.name,

    last5: sourcePlayer?.last5
      ? {
          pts: sourcePlayer.last5.avgPoints,
          ast: sourcePlayer.last5.avgAssists,
          reb: sourcePlayer.last5.avgRebounds,
        }
      : undefined,
  };
});

    const totalSignals = contexts.reduce((sum, p) => sum + p.hits, 0);
    const avgScore = contexts.length > 0 ? totalSignals / contexts.length : 0;

    gameResults.push({
      id: String(game.gameId),
      gameId: String(game.gameId),
      homeTeam: game.homeTeam.abbreviation,
      awayTeam: game.awayTeam.abbreviation,
      homeTeamName: game.homeTeam.displayName,
      awayTeamName: game.awayTeam.displayName,
      date: game.date,
      totalSignals,
      activePlayers: contexts.length,
      syncScore: Number(avgScore.toFixed(2)),
    });

    console.log("[runDailyEngine] AFTER PUSH", {
      justPushed: String(game.gameId),
      gameResultsLength: gameResults.length,
      currentGameResults: gameResults.map((g) => ({
        gameId: g.gameId,
        home: g.homeTeam,
        away: g.awayTeam,
      })),
    });

    allPlayerContexts.push(...contexts);
  }

  console.log("[runDailyEngine] BEFORE RETURN", {
    finalGamesLength: gameResults.length,
    finalGameIds: gameResults.map((g) => g.gameId),
  });

  const sortedPlayers = [...allPlayerContexts].sort((a, b) => b.score - a.score);
  const topPlays = sortedPlayers.slice(0, 10);

  const mostActiveGame =
    [...gameResults].sort((a, b) => b.totalSignals - a.totalSignals)[0] || null;

  return {
    date,
    numbers,
    games: gameResults,
    playerContexts: allPlayerContexts,
    topPlays,
    mostActiveGame,
  };
}