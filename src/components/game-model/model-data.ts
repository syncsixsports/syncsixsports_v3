import { runDailyEngine } from "../../engine/runDailyEngine";
import { computeDateNumerology } from "../../engine/dateNumerology";
import { computeGematria } from "../../engine/gematria";

import type { GameModelData, GameModelPlayer, Insight } from "./types";
import { buildMasterData } from "../../lib/transformers/buildMasterData";

// ======================================================
// MAIN BUILDER
// ======================================================

export async function getGameModelData(
  date: string
): Promise<GameModelData> {
  const masterGames = await buildMasterData(date);
  const engineOutput = await runDailyEngine(masterGames, date);

  const game = engineOutput.mostActiveGame ?? engineOutput.games[0];

  if (!game) {
    throw new Error("No game data available");
  }

  // --------------------------------------------------
  // PLAYERS
  // --------------------------------------------------

  const playersForGame = engineOutput.playerContexts.filter(
    (p) => String(p.gameId) === String(game.id)
  );

  const TAG_MAP: Record<string, "DOM" | "ALT" | "GEM" | "SYNC" | "ROOT"> = {
    jersey_equals_dom: "DOM",
    jersey_in_date_components: "ALT",
    player_gematria_equals_dom: "GEM",
    player_gematria_in_date_components: "GEM",
    player_gematria_equals_team: "SYNC",
    player_gematria_equals_opponent: "SYNC",
    team_gematria_in_date_components: "ALT",
    opponent_gematria_in_date_components: "ALT",
    is_player_birthday_today: "ROOT",
  };

  const players = playersForGame.map((p) => {
    const rawReasons = p.reasons || [];
    const rawSignals = p.signals || [];

    const tags = rawReasons
      .map((r: string) => TAG_MAP[r as keyof typeof TAG_MAP])
      .filter(
        (tag: string | undefined): tag is "DOM" | "ALT" | "GEM" | "SYNC" | "ROOT" =>
          Boolean(tag)
      )
      .slice(0, 2);

    const syncPercent =
      rawSignals.length > 0
        ? Math.round((p.hits / rawSignals.length) * 100)
        : 0;

    return {
      id: Number(p.playerId),
      name: p.name,

      teamAbbr: p.team,
      teamName: p.team,
      opponent: p.opponent,

      jersey: "",
      headshot: p.headshot || "",

      syncPercent,
      hits: p.hits,

      tags: tags.length ? tags : ["DOM"],

      breakdown: rawReasons.length
        ? rawReasons.map((r: string) => r.replaceAll("_", " "))
        : ["Signal cluster detected"],

      signals: rawSignals,

      prop: "OVER 20.5 Points",

      position: "",
      trend: "neutral",
      status: "",
      age: 0,
      experienceYears: 0,

      last5: null,
      last10: null,
      seasonAvg: null,
    };
  });

  // --------------------------------------------------
  // TEAM DATA
  // --------------------------------------------------

  const homePlayers = playersForGame.filter((p) => p.team === game.homeTeam);
  const awayPlayers = playersForGame.filter((p) => p.team === game.awayTeam);

  const avg = (arr: any[], key: string) =>
    arr.length
      ? arr.reduce((sum, p) => sum + Number(p?.[key] ?? 0), 0) / arr.length
      : 0;

  const avgTeamValue = (arr: any[]) => {
    const ppgAvg = avg(arr, "pointsPerGame");
    if (ppgAvg > 0) return ppgAvg;

    return avg(arr, "score");
  };

  const topBy = (arr: any[], key: string) =>
    [...arr].sort((a, b) => Number(b?.[key] ?? 0) - Number(a?.[key] ?? 0))[0];

  const teams = {
    home: {
      name: game.homeTeamName,
      abbr: game.homeTeam,
      ppg: Number(avgTeamValue(homePlayers).toFixed(1)),
      topScorer: homePlayers.length
        ? {
          name: topBy(homePlayers, "score").name,
          value: Number(topBy(homePlayers, "score").score.toFixed(1)),
        }
        : undefined,
      topRebounder:
        homePlayers.length && homePlayers.some((p: any) => Number(p?.reboundsPerGame ?? 0) > 0)
          ? {
            name: topBy(homePlayers, "reboundsPerGame").name,
            value: Number(
              Number(topBy(homePlayers, "reboundsPerGame")?.reboundsPerGame ?? 0).toFixed(1)
            ),
          }
          : undefined,
      topAssister:
        homePlayers.length && homePlayers.some((p: any) => Number(p?.assistsPerGame ?? 0) > 0)
          ? {
            name: topBy(homePlayers, "assistsPerGame").name,
            value: Number(
              Number(topBy(homePlayers, "assistsPerGame")?.assistsPerGame ?? 0).toFixed(1)
            ),
          }
          : undefined,
    },
    away: {
      name: game.awayTeamName,
      abbr: game.awayTeam,
      ppg: Number(avgTeamValue(awayPlayers).toFixed(1)),
      topScorer: awayPlayers.length
        ? {
          name: topBy(awayPlayers, "score").name,
          value: Number(topBy(awayPlayers, "score").score.toFixed(1)),
        }
        : undefined,
      topRebounder:
        awayPlayers.length && awayPlayers.some((p: any) => Number(p?.reboundsPerGame ?? 0) > 0)
          ? {
            name: topBy(awayPlayers, "reboundsPerGame").name,
            value: Number(
              Number(topBy(awayPlayers, "reboundsPerGame")?.reboundsPerGame ?? 0).toFixed(1)
            ),
          }
          : undefined,
      topAssister:
        awayPlayers.length && awayPlayers.some((p: any) => Number(p?.assistsPerGame ?? 0) > 0)
          ? {
            name: topBy(awayPlayers, "assistsPerGame").name,
            value: Number(
              Number(topBy(awayPlayers, "assistsPerGame")?.assistsPerGame ?? 0).toFixed(1)
            ),
          }
          : undefined,
    },
  };

  // --------------------------------------------------
  // NUMEROLOGY
  // --------------------------------------------------

  const numerology = computeDateNumerology(date);

  // --------------------------------------------------
  // GEMATRIA (MULTI-VARIANT MATCH SYSTEM)
  // --------------------------------------------------

  const teamVariants = (fullName: string, abbr: string) => {
    const parts = fullName.split(" ");
    const short = parts[parts.length - 1];
    const alt = parts.length >= 2 ? `${parts[0][0]}. ${short}` : short;

    return [
      { label: fullName, value: computeGematria(fullName).value },
      { label: alt, value: computeGematria(alt).value },
      { label: short, value: computeGematria(short).value },
      { label: abbr, value: computeGematria(abbr).value },
    ];
  };

  const homeVariants = teamVariants(game.homeTeamName, game.homeTeam);
  const awayVariants = teamVariants(game.awayTeamName, game.awayTeam);

  const gematriaRows: {
    label: string;
    value: number;
    match?: boolean;
  }[] = [];

  const matches: {
    teamLabel: string;
    teamValue: number;
    players: { name: string; value: number; abbr: string }[];
  }[] = [];

  const processTeam = (
    variants: { label: string; value: number }[],
    teamAbbr: string
  ) => {
    for (const variant of variants) {
      const matchedPlayers = playersForGame
        .filter((p) => p.gematria === variant.value)
        .map((p) => ({
          name: p.name,
          value: p.gematria,
          abbr: teamAbbr,
        }));

      if (matchedPlayers.length > 0) {
        matches.push({
          teamLabel: variant.label,
          teamValue: variant.value,
          players: matchedPlayers,
        });
        break;
      }
    }
  };

  processTeam(homeVariants, game.homeTeam);
  processTeam(awayVariants, game.awayTeam);

  if (matches.length > 0) {
    matches.forEach((m) => {
      gematriaRows.push({
        label: m.teamLabel,
        value: m.teamValue,
      });

      m.players.forEach((p) => {
        gematriaRows.push({
          label: `${p.name} → ${p.abbr}`,
          value: p.value,
          match: true,
        });
      });
    });
  } else {
    gematriaRows.push({
      label: game.homeTeamName,
      value: computeGematria(game.homeTeamName).value,
    });

    gematriaRows.push({
      label: game.awayTeamName,
      value: computeGematria(game.awayTeamName).value,
    });
  }

  /// --------------------------------------------------
  // INSIGHTS (ENGINE → UI READY)
  // --------------------------------------------------

  function buildInsights(players: any[]): Insight[] {
    if (!players || players.length === 0) return [];

    // -----------------------------
    // SORT BY SIGNAL STRENGTH
    // -----------------------------
    const sorted = [...players].sort((a, b) => b.hits - a.hits);

    const top = sorted[0];

    const value =
      sorted.find(
        (p) =>
          p.id !== top?.id &&
          p.hits >= Math.max(2, Math.floor(top.hits * 0.75))
      ) || null;

    const hidden =
      sorted.find(
        (p) =>
          p.id !== top?.id &&
          p.id !== value?.id &&
          p.hits >= 2
      ) || null;

    // -----------------------------
    // HUMANIZE SIGNALS
    // -----------------------------
    function humanize(signal: string) {
      const map: Record<string, string> = {
        jersey_equals_dom: "Jersey matches Day Number",
        jersey_in_date_components: "Jersey aligns with date components",
        player_gematria_equals_dom: "Name matches Day Number",
        player_gematria_in_date_components: "Name aligns with date",
        player_gematria_equals_team: "Name matches team numerology",
        player_gematria_equals_opponent: "Name matches opponent numerology",
        team_gematria_in_date_components: "Team aligns with date",
        opponent_gematria_in_date_components: "Opponent aligns with date",
        is_player_birthday_today: "Birthday alignment",
      };

      return map[signal] || signal.replaceAll("_", " ");
    }

    // -----------------------------
    // BUILD INSIGHTS
    // -----------------------------
    const insights: Insight[] = [];

    if (top) {
      insights.push({
        type: "top",
        player: top.name,
        detail: `${top.hits} signals including ${top.signals
          ?.slice(0, 2)
          .map((s: any) => humanize(s.id))
          .join(", ")}`,
      });
    }

    if (value) {
      insights.push({
        type: "value",
        player: value.name,
        detail: `${value.hits} strong alignments — high relative value`,
      });
    }

    if (hidden) {
      insights.push({
        type: "hidden",
        player: hidden.name,
        detail: `Low-profile alignment with ${hidden.hits} signals`,
      });
    }

    return insights;
  }

  // --------------------------------------------------
  // FINAL RETURN
  // --------------------------------------------------

  return {
    gameId: game.id,
    date,

    homeTeamId: 0,
    awayTeamId: 0,

    displayHomeName: game.homeTeam,
    displayAwayName: game.awayTeam,

    syncScore: game.syncScore,
    alignmentLabel: game.syncScore > 12 ? "High Alignment" : "Moderate",

    teams,

    numerology: [
      { key: "DOM", value: numerology.dom },
      { key: "FULL", value: numerology.row1_fullSum },
      { key: "ALT", value: numerology.row2_mixedYearDigits },
      { key: "ROOT", value: numerology.row3_fullDigits },
      { key: "YR", value: numerology.row4_shortYear },
    ],

    gematria: gematriaRows,

    aiInsights: buildInsights(playersForGame),

    players: players.sort((a, b) => b.syncPercent - a.syncPercent),
  };
}