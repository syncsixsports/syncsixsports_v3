export type NumerologyItem = {
  key: string;
  value: number | string;
};

export type GematriaValue = {
  label: string;
  value: number;
  match?: boolean;
};

export type PlayerTag = "DOM" | "GEM" | "SYNC" | "ROOT" | "ALT";

export type GameModelPlayer = {
  id: number;
  name: string;

  teamAbbr: string;
  teamName: string;
  opponent: string;

  jersey: string;
  headshot: string;

  // -------------------------
  // CORE SIGNAL DATA
  // -------------------------
  syncPercent: number;
  hits: number;

  tags: string[];
  breakdown: string[];

  signals: {
    id: string;
    hit: boolean;
  }[];

  // -------------------------
  // UI / INTERACTION
  // -------------------------
  prop?: string;

  // -------------------------
  // PLAYER CONTEXT (EXPANDED VIEW)
  // -------------------------
  position?: string;
  trend?: string;
  status?: string;

  age?: number;
  experienceYears?: number;

  last5?: any;
  last10?: any;
  seasonAvg?: any;
};

export type Insight = {
  type: "top" | "value" | "hidden";
  player: string;
  detail: string;
};

export type TeamInfo = {
  id?: number;
  name: string;
  abbr: string;

  // NEW — for header + context
  ppg?: number;

  topScorer?: {
    name: string;
    value: number;
  };

  topRebounder?: {
    name: string;
    value: number;
  };

  topAssister?: {
    name: string;
    value: number;
  };
};

export type GameModelData = {
  gameId: number;
  date: string;

  homeTeamId: number;
  awayTeamId: number;

  displayHomeName: string;
  displayAwayName: string;

  // LEGACY (can remove later if unused)
  syncScore: number;
  alignmentLabel: string;

  // 🔥 NEW STRUCTURE
  teams: {
    home: TeamInfo;
    away: TeamInfo;
  };

  numerology: NumerologyItem[];
  gematria: GematriaValue[];

  aiInsights: Insight[];

  players: GameModelPlayer[];
};