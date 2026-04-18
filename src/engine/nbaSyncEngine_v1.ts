// ======================================================
// NBA SYNC ENGINE (v3 — GEMATRIA + BIRTHDAY ALIGNED)
// ======================================================

import { DateNumerology } from "./dateNumerology";
import { computeGematria, checkBirthday } from "./gematria";

// ======================================================
// TYPES
// ======================================================

export type NBAPlayer = {
  id: number;
  name: string;
  jersey: number;
  teamAbbr: string;
  teamName: string;
  dob: string | null;
  opponent: string;
};

type Signal = {
  id: string;
  hit: boolean;
};

type EnginePlayerResult = {
  id: number;
  name: string;
  teamAbbr: string;
  opponent: string;
  signals: Signal[];
};

// ======================================================
// MAIN ENGINE
// ======================================================

export function runNBASyncEngine(
  players: NBAPlayer[],
  numbers: DateNumerology,
  currentDate: string
)
  : EnginePlayerResult[] {
  return players.map((player) => {
    // ==================================================
    // GEMATRIA (NEW ENGINE)
    // ==================================================
    const playerGematria = computeGematria(player.name).value;
    const teamGematria = computeGematria(player.teamName).value;
    const opponent = player.opponent || "UNK";
    const opponentGematria = computeGematria(opponent).value;

    // ==================================================
    // BIRTHDAY CHECK (PST SAFE)
    // ==================================================
    const birthday = checkBirthday(player.dob, currentDate);
    // ==================================================
    // SIGNALS
    // ==================================================
    const signals: Signal[] = [
      // -------------------------------
      // DOM
      // -------------------------------
      {
        id: "jersey_equals_dom",
        hit: player.jersey === numbers.dom,
      },

      // -------------------------------
      // DATE COMPONENTS
      // -------------------------------
      {
        id: "jersey_in_date_components",
        hit: numbers.allComponents.includes(player.jersey),
      },

      // -------------------------------
      // PLAYER GEMATRIA
      // -------------------------------
      {
        id: "player_gematria_equals_dom",
        hit: playerGematria === numbers.dom,
      },
      {
        id: "player_gematria_in_date_components",
        hit: numbers.allComponents.includes(playerGematria),
      },

      // -------------------------------
      // RELATIONAL GEMATRIA
      // -------------------------------
      {
        id: "player_gematria_equals_team",
        hit: playerGematria === teamGematria,
      },
      {
        id: "player_gematria_equals_opponent",
        hit: playerGematria === opponentGematria,
      },
      {
        id: "team_gematria_in_date_components",
        hit: numbers.allComponents.includes(teamGematria),
      },
      {
        id: "opponent_gematria_in_date_components",
        hit: numbers.allComponents.includes(opponentGematria),
      },

      {
        id: "jersey_equals_team_gematria",
        hit: player.jersey === teamGematria,
      },
      {
        id: "jersey_equals_opponent_gematria",
        hit: player.jersey === opponentGematria,
      },

      // -------------------------------
      // HYBRID SIGNALS
      // -------------------------------
      {
        id: "jersey_prime_and_date_has_prime",
        hit: numbers.primeComponents.includes(player.jersey),
      },
      {
        id: "jersey_master_and_date_has_master",
        hit: numbers.masterCandidates.includes(player.jersey),
      },

      // -------------------------------
      // BIRTHDAY
      // -------------------------------
      {
        id: "is_player_birthday_today",
        hit: birthday.isToday,
      },
    ];

    return {
      id: player.id,
      name: player.name,
      teamAbbr: player.teamAbbr,
      opponent,
      signals,
    };
  });
}