import { MasterGameData } from "../../types/master";
import type { MasterPlayer } from "../../types/master";
import {
  getNBAGamesWithStats,
  fetchTeamRoster,
  fetchPlayerGameLog
} from "../../api/nba";
/**
 * ENTRY POINT
 */
export async function buildMasterData(date: string): Promise<MasterGameData[]> {
  const games = await getNBAGamesWithStats(date);

  const results: MasterGameData[] = [];

  for (const game of games) {
    const homeRoster = await fetchTeamRoster(game.homeTeam.id);
    const awayRoster = await fetchTeamRoster(game.awayTeam.id);

  const players: MasterPlayer[] = await Promise.all([
  ...homeRoster.map((p) => buildPlayer(p, game, true)),
  ...awayRoster.map((p) => buildPlayer(p, game, false)),
]);

    const masterGame: MasterGameData = {
      gameId: String(game.id),
      date: game.date,

      status: {
        state: "pre",
        description: "",
        detail: "",
        period: 0,
        clock: 0,
      },

      season: {
        year: new Date(game.date).getFullYear(),
        type: 2,
        name: "Regular Season",
      },

      venue: {
        name: "",
        city: "",
        state: "",
        indoor: true,
      },

      broadcasts: [],
      betting: [],

      homeTeam: {
        id: String(game.homeTeam.id),
        name: game.homeTeam.name,
        displayName: game.homeTeam.name,
        abbreviation: game.homeTeam.abbr,
        location: "",
        logo: "",
        color: "",
        alternateColor: "",
        score: 0,
        winner: false,

        record: {
          summary: "",
          home: "",
          away: "",
        },

        gameStats: emptyTeamStats(),
        seasonStats: emptySeasonStats(),
      },

      awayTeam: {
        id: String(game.awayTeam.id),
        name: game.awayTeam.name,
        displayName: game.awayTeam.name,
        abbreviation: game.awayTeam.abbr,
        location: "",
        logo: "",
        color: "",
        alternateColor: "",
        score: 0,
        winner: false,

        record: {
          summary: "",
          home: "",
          away: "",
        },

        gameStats: emptyTeamStats(),
        seasonStats: emptySeasonStats(),
      },

      players,

      leaders: [],
      links: [],
    };

    results.push(masterGame);
  }

  return results;
}

async function buildPlayer(
  player: any,
  game: any,
  isHome: boolean
): Promise<MasterPlayer> {
  const team = isHome ? game.homeTeam : game.awayTeam;
  const opponent = isHome ? game.awayTeam : game.homeTeam;

  // ======================
  // FETCH REAL GAME LOGS
  // ======================
  const logs = await fetchPlayerGameLog(player.id);
  const last5 = computeLast5(logs);

  return {
    id: String(player?.id ?? ""),

    fullName: String(player?.name ?? ""),
    displayName: String(player?.name ?? ""),
    shortName: String(player?.name ?? ""),

    teamId: String(team?.id ?? ""),
    teamAbbr: String(team?.abbr ?? ""),
    opponentTeamId: String(opponent?.id ?? ""),

    headshot: String(
      player?.headshot ||
      `https://a.espncdn.com/i/headshots/nba/players/full/${player?.id ?? ""}.png`
    ),

    jersey: String(player?.jersey ?? ""),

    position: {
      name: String(player?.position?.name ?? ""),
      abbreviation: String(player?.position?.abbreviation ?? ""),
    },

    height: normalizeHeight(player?.height),
    weight: normalizeWeight(player?.weight),
    age: normalizeNumber(player?.age),

    dateOfBirth: String(player?.dob ?? ""),

    experienceYears: Number(player?.experience?.years ?? 0),

    college: {
      id: "",
      name:
        typeof player?.college === "string"
          ? player.college
          : String(player?.college?.name ?? ""),
      abbreviation: "",
    },

    status: {
      type: String(player?.status ?? ""),
    },

    injuries: [],

    contract: {
      salary: 0,
      yearsRemaining: 0,
      active: false,
    },

    // ✅ REAL DATA NOW
    last5,
    last10: emptyAverages(),

    seasonAvg: {
      avgPoints: Number(player?.stats?.points ?? 0),
      avgRebounds: Number(player?.stats?.rebounds ?? 0),
      avgAssists: Number(player?.stats?.assists ?? 0),
      avgMinutes: Number(player?.stats?.minutes ?? 0),
    },

    trend: "neutral",

    gameLogs: [],
  };
}

/**
 * HELPERS
 */
function normalizeNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function normalizeWeight(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;

  if (typeof value === "string") {
    const digits = value.replace(/[^\d]/g, "");
    const parsed = Number(digits);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function normalizeHeight(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;

  if (typeof value === "string") {
    // supports formats like 6'6", 6' 6", 78
    const feetInches = value.match(/(\d+)\s*'\s*(\d+)/);
    if (feetInches) {
      const feet = Number(feetInches[1]);
      const inches = Number(feetInches[2]);
      return feet * 12 + inches;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function emptyAverages() {
  return {
    avgPoints: 0,
    avgRebounds: 0,
    avgAssists: 0,
    avgMinutes: 0,
  };
}

function emptyTeamStats() {
  return {
    points: 0,
    rebounds: 0,
    assists: 0,
    fgPct: 0,
    threePtPct: 0,
    ftPct: 0,
    turnovers: 0,
  };
}

function emptySeasonStats() {
  return {
    gamesPlayed: 0,
    avgPoints: 0,
    avgRebounds: 0,
    avgAssists: 0,
    avgTurnovers: 0,
    fgPct: 0,
    threePtPct: 0,
    ftPct: 0,
  };
}

function computeLast5(logs: any[]) {
  if (!logs || logs.length === 0) {
    return {
      avgPoints: 0,
      avgRebounds: 0,
      avgAssists: 0,
      avgMinutes: 0,
    };
  }

  const totals = logs.reduce(
    (acc: { pts: number; reb: number; ast: number }, g: any) => {
      acc.pts += g.points || 0;
      acc.reb += g.rebounds || 0;
      acc.ast += g.assists || 0;
      return acc;
    },
    { pts: 0, reb: 0, ast: 0 }
  );

  const count = logs.length;

  return {
    avgPoints: +(totals.pts / count).toFixed(1),
    avgRebounds: +(totals.reb / count).toFixed(1),
    avgAssists: +(totals.ast / count).toFixed(1),
    avgMinutes: 0,
  };
}