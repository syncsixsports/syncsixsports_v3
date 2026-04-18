export type MasterGameData = {
    gameId: string;
  date: string;

  status: {
    state: "pre" | "in" | "post";
    description: string;
    detail: string;
    period: number;
    clock: number;
  };

  season: {
    year: number;
    type: number;
    name: string;
  };

  venue: {
    name: string;
    city: string;
    state: string;
    indoor: boolean;
  };

  broadcasts: {
    market: string;
    network: string;
    names: string[];
  }[];

  betting: {
    providerId: string;
    providerName: string;
    spread: number;
    spreadDetails: string;
    overUnder: number;
    homeMoneyline: number;
    awayMoneyline: number;
    overOdds: number;
    underOdds: number;
  }[];

  homeTeam: {
    id: string;
    name: string;
    displayName: string;
    abbreviation: string;
    location: string;
    logo: string;
    color: string;
    alternateColor: string;
    score: number;
    winner: boolean;

    record: {
      summary: string;
      home: string;
      away: string;
    };

    gameStats: {
      points: number;
      rebounds: number;
      assists: number;
      fgPct: number;
      threePtPct: number;
      ftPct: number;
      turnovers: number;
    };

    seasonStats: {
      gamesPlayed: number;
      avgPoints: number;
      avgRebounds: number;
      avgAssists: number;
      avgTurnovers: number;
      fgPct: number;
      threePtPct: number;
      ftPct: number;
    };
  };

  awayTeam: {
    id: string;
    name: string;
    displayName: string;
    abbreviation: string;
    location: string;
    logo: string;
    color: string;
    alternateColor: string;
    score: number;
    winner: boolean;

    record: {
      summary: string;
      home: string;
      away: string;
    };

    gameStats: {
      points: number;
      rebounds: number;
      assists: number;
      fgPct: number;
      threePtPct: number;
      ftPct: number;
      turnovers: number;
    };

    seasonStats: {
      gamesPlayed: number;
      avgPoints: number;
      avgRebounds: number;
      avgAssists: number;
      avgTurnovers: number;
      fgPct: number;
      threePtPct: number;
      ftPct: number;
    };
  };

  players: {
    id: string;
    fullName: string;
    displayName: string;
    shortName: string;

    teamId: string;
    teamAbbr: string;
    opponentTeamId: string;

    headshot: string;

    jersey: string;

    position: {
      name: string;
      abbreviation: string;
    };

    height: number;
    weight: number;
    age: number;
    dateOfBirth: string;

    experienceYears: number;

    college: {
      id: string;
      name: string;
      abbreviation: string;
    };

    status: {
      type: string;
    };

    injuries: {
      status: string;
      date: string;
    }[];

    contract: {
      salary: number;
      yearsRemaining: number;
      active: boolean;
    };

    last5: {
      avgPoints: number;
      avgRebounds: number;
      avgAssists: number;
      avgMinutes: number;
    };

    last10: {
      avgPoints: number;
      avgRebounds: number;
      avgAssists: number;
      avgMinutes: number;
    };

    seasonAvg: {
      avgPoints: number;
      avgRebounds: number;
      avgAssists: number;
      avgMinutes: number;
    };

    trend: "hot" | "cold" | "neutral";

    gameLogs: {
      gameId: string;
      date: string;
      opponentId: string;
      opponentAbbr: string;
      result: string;

      minutes: number;
      points: number;
      rebounds: number;
      assists: number;

      steals: number;
      blocks: number;
      turnovers: number;

      fgMade: number;
      fgAttempted: number;
      threePtMade: number;
      threePtAttempted: number;
      ftMade: number;
      ftAttempted: number;
    }[];
  }[];

  leaders: {
    playerId: string;
    fullName: string;
    teamId: string;

    category: string;
    value: number;
    displayValue: string;
  }[];

  situation?: {
    lastPlay: string;
    possession: string;
    winProbability: number;
  };

  links: {
    rel: string;
    href: string;
    text: string;
  }[];
};

export type AppPlayer = {
  id: number;
  name: string;

  team: string;
  opponent: string;

  headshot: string;

  hits: number;
  reasons: string[];
  sync: number;

  age?: number;
  height?: string;
  position?: string;
  college?: string;
  draft?: string;

  last5?: {
    pts: number;
    ast: number;
    reb: number;
  };
};

export type MasterPlayer = MasterGameData["players"][number];