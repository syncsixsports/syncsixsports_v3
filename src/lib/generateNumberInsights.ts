type PlayerContext = {
  name: string;
  jersey?: number;
  team?: string;
  gematria: number; // 🔥 REQUIRED
};

type Numbers = {
  dom: number;
  coreNumbers: number[];
};

type Match = {
  name: string;
  value: number;
  matchedTo: string;
};

type Output = {
  dom: number;
  coreNumbers: number[];

  matches: Match[];

  signalStrength: "strong" | "moderate" | "weak";
};

export function generateNumberInsights({
  playerContexts,
  numbers,
}: {
  playerContexts: PlayerContext[];
  numbers: Numbers;
}): Output {
  const dom = numbers.dom;
  const coreNumbers = numbers.coreNumbers || [];

  const matches: Match[] = [];

  // =====================
  // MATCH LOGIC (REAL)
  // =====================
  for (const player of playerContexts) {
    if (!player.gematria) continue;

    // DOM MATCH
    if (player.gematria === dom) {
      matches.push({
        name: player.name,
        value: player.gematria,
        matchedTo: "DOM",
      });
    }

    // CORE STACK MATCH
    else if (coreNumbers.includes(player.gematria)) {
      matches.push({
        name: player.name,
        value: player.gematria,
        matchedTo: "CORE",
      });
    }
  }

  // =====================
  // DEBUG (CRITICAL)
  // =====================
  console.log("REAL GEMATRIA MATCHES:", matches);

  // =====================
  // SIGNAL STRENGTH
  // =====================
  let signalStrength: "strong" | "moderate" | "weak" = "weak";

  if (matches.length >= 6) {
    signalStrength = "strong";
  } else if (matches.length >= 3) {
    signalStrength = "moderate";
  }

  return {
    dom,
    coreNumbers,
    matches,
    signalStrength,
  };
}