// ======================================================
// SYNC6 CORE ENGINE (v1)
// Single Source of Truth Engine
// ======================================================

// IMPORTS (adjust paths as needed)
import { computeDateNumerology } from "./engine/dateNumerology";
import { runNBASyncEngine } from "./engine/nbaSyncEngine_v1";
import { fetchGamesByDate, normalizeGames, getMergedRostersForEngine } from "./api/nba";

// ======================================================
// TYPES
// ======================================================

type SignalResult = {
  id: string;
  hit: boolean;
  weight: number;
};

type PlayerGameContext = {
  playerId: number;
  name: string;
  team: string;
  opponent: string;
  gameId: number;

  signals: SignalResult[];
  hits: number;
  score: number;

  reasons: string[];
  isTopPlay: boolean;
};

type Game = {
  id: number;
  homeTeam: string;
  awayTeam: string;
  date: string;

  totalSignals: number;
  activePlayers: number;
};

type DailyData = {
  date: string;
  numbers: any;

  games: Game[];
  playerContexts: PlayerGameContext[];

  topPlays: PlayerGameContext[];
  mostActiveGame: Game | null;
  insights: string[];
};

// ======================================================
// SIGNAL WEIGHTS
// ======================================================

const SIGNAL_WEIGHTS: Record<string, number> = {
  jersey_equals_dom: 3,
  jersey_in_date_components: 2,
  jersey_prime_and_date_has_prime: 1,
  jersey_master_and_date_has_master: 3,

  player_gematria_equals_dom: 4,
  player_gematria_in_date_components: 2,

  player_gematria_equals_team: 2,
  player_gematria_equals_opponent: 2,

  team_gematria_in_date_components: 1,
  opponent_gematria_in_date_components: 1,

  is_player_birthday_today: 5,
};

// ======================================================
// HELPERS
// ======================================================

function calculateScore(signals: SignalResult[]) {
  const score = signals
    .filter(s => s.hit)
    .reduce((sum, s) => sum + s.weight, 0);

  const maxScore = signals.reduce((sum, s) => sum + s.weight, 0);

  const pct = maxScore === 0 ? 0 : (score / maxScore) * 100;

  return { score, pct };
}

function buildReasons(signals: SignalResult[]) {
  return signals
    .filter(s => s.hit)
    .map(s => s.id);
}

// ======================================================
// MAIN ENGINE
// ======================================================

export async function runDailyEngine(date: string): Promise<DailyData> {
  console.log(`\n🚀 RUNNING SYNC6 ENGINE FOR ${date}`);

  // 1. DATE NUMEROLOGY
  const numbers = computeDateNumerology(date);

  // 2. FETCH + NORMALIZE GAMES
  const rawGames = await fetchGamesByDate(date);
  const normalizedGames = normalizeGames(rawGames);

  const allPlayerContexts: PlayerGameContext[] = [];
  const gameResults: Game[] = [];

  // 3. PROCESS EACH GAME
  for (const game of normalizedGames) {
    const rosters = getMergedRostersForEngine(game.home.id, game.away.id);

    const engineResults = runNBASyncEngine(rosters, numbers);

    let gameSignalTotal = 0;

    const playerContexts: PlayerGameContext[] = engineResults.map((p: any) => {
      const signals: SignalResult[] = p.signals.map((s: any) => ({
        id: s.id,
        hit: s.hit,
        weight: SIGNAL_WEIGHTS[s.id] || 1,
      }));

      const { score } = calculateScore(signals);

      const hits = signals.filter(s => s.hit).length;

      gameSignalTotal += hits;

      return {
        playerId: p.id,
        name: p.name,
        team: p.teamAbbr,
        opponent: p.opponent,
        gameId: game.id,

        signals,
        hits,
        score,

        reasons: buildReasons(signals),
        isTopPlay: false,
      };
    });

    allPlayerContexts.push(...playerContexts);

    gameResults.push({
      id: game.id,
      homeTeam: game.home.abbreviation,
      awayTeam: game.away.abbreviation,
      date: game.date,

      totalSignals: gameSignalTotal,
      activePlayers: playerContexts.length,
    });
  }

  // 4. GLOBAL RANKING
  const sortedPlayers = [...allPlayerContexts].sort((a, b) => b.score - a.score);

  const topPlays = sortedPlayers.slice(0, 3).map(p => ({
    ...p,
    isTopPlay: true,
  }));

  // 5. MOST ACTIVE GAME
  const mostActiveGame = gameResults.sort((a, b) => b.totalSignals - a.totalSignals)[0] || null;

  // 6. INSIGHTS
  const insights: string[] = [];

  if (topPlays.length > 0) {
    insights.push(`Top play: ${topPlays[0].name} (${topPlays[0].score})`);
  }

  if (mostActiveGame) {
    insights.push(`Most active game: ${mostActiveGame.homeTeam} vs ${mostActiveGame.awayTeam}`);
  }

  insights.push(`DOM ${numbers.dom} is active today`);

  // ======================================================

  return {
    date,
    numbers,

    games: gameResults,
    playerContexts: allPlayerContexts,

    topPlays,
    mostActiveGame,
    insights,
  };
}
