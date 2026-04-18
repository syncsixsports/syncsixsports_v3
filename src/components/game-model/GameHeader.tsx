"use client";

import Card from "../ui/Card";

// ---------------------------------------------
// TYPES
// ---------------------------------------------
type Props = {
  game: {
    homeTeamName: string;
    awayTeamName: string;
    homeTeamAbbr: string;
    awayTeamAbbr: string;

    syncScore: number;
    totalSignals: number;
    activePlayers: number;

    tipoff?: string;

    homeRecord?: string;
    awayRecord?: string;

    venue?: {
      name?: string;
      city?: string;
    };

    status?: {
      state?: string;
      period?: number;
      clock?: number;
    };

    betting?: {
      spread?: number;
      spreadDetails?: string;
      overUnder?: number;
    } | null;
  };
};

// ---------------------------------------------
// HELPERS
// ---------------------------------------------
function getLogo(abbr: string) {
  return `https://a.espncdn.com/i/teamlogos/nba/500/${abbr.toLowerCase()}.png`;
}

// ---------------------------------------------
// COMPONENT
// ---------------------------------------------
export default function GameHeader({ game }: Props) {
  const percent = Math.round(game.syncScore * 100);

  return (
    <Card variant="strong" padding="lg">
      {/* =====================
          MATCHUP
      ===================== */}
      <div className="flex items-center justify-between">
        <img
          src={getLogo(game.homeTeamAbbr)}
          alt={game.homeTeamName}
          className="h-14 w-14 object-contain"
        />

        <div className="text-center px-4">
          <div className="text-xs text-white/40 tracking-wide">
            GAME
          </div>

          <div className="text-xl font-semibold tracking-tight">
            {game.homeTeamName}{" "}
            <span className="text-white/40">vs</span>{" "}
            {game.awayTeamName}
          </div>
        </div>

        <img
          src={getLogo(game.awayTeamAbbr)}
          alt={game.awayTeamName}
          className="h-14 w-14 object-contain"
        />
      </div>

      {/* =====================
          CORE SIGNAL METRICS
      ===================== */}
      <div className="mt-5 grid grid-cols-3 text-center gap-2">

        <div>
          <div className="text-[10px] text-white/40 uppercase">
            Sync
          </div>
          <div className="text-lg font-semibold text-cyan-400">
            {percent}%
          </div>
        </div>

        <div>
          <div className="text-[10px] text-white/40 uppercase">
            Signals
          </div>
          <div className="text-lg font-semibold text-purple-400">
            {game.totalSignals}
          </div>
        </div>

        <div>
          <div className="text-[10px] text-white/40 uppercase">
            Players
          </div>
          <div className="text-lg font-semibold text-orange-400">
            {game.activePlayers}
          </div>
        </div>

      </div>

      {/* =====================
          CONTEXT ROW
      ===================== */}
      {(game.homeRecord || game.awayRecord) && (
        <div className="mt-4 text-sm text-white/70 text-center">
          {game.homeTeamAbbr} ({game.homeRecord}){" "}
          <span className="text-white/40">vs</span>{" "}
          {game.awayTeamAbbr} ({game.awayRecord})
        </div>
      )}

      {/* =====================
          BETTING (OPTIONAL)
      ===================== */}
      {game.betting && (
        <div className="mt-2 text-sm text-white/70 text-center">
          Spread: {game.betting.spreadDetails || game.betting.spread}{" "}
          <span className="text-white/40">•</span>{" "}
          O/U: {game.betting.overUnder}
        </div>
      )}

      {/* =====================
          VENUE / TIME
      ===================== */}
      {(game.tipoff || game.venue?.name) && (
        <div className="mt-2 text-xs text-white/50 text-center">
          {game.tipoff && <span>{game.tipoff}</span>}
          {game.tipoff && game.venue?.name && (
            <span className="mx-2">•</span>
          )}
          {game.venue?.name && (
            <span>
              {game.venue.name}
              {game.venue.city ? `, ${game.venue.city}` : ""}
            </span>
          )}
        </div>
      )}

      {/* =====================
          PROGRESS BAR
      ===================== */}
      <div className="mt-4 h-[6px] w-full bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-orange-400"
          style={{ width: `${percent}%` }}
        />
      </div>
    </Card>
  );
}