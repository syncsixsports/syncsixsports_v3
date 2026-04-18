"use client";

import { useRouter } from "next/navigation";

import ButtonPrimary from "./ui/ButtonPrimary";

type Game = {
  id: number;
  homeTeam: string;
  awayTeam: string;
  time: string;
  syncScore: number;
  totalSignals: number;
  activePlayers: number;
};

export default function MostActiveGame({ game }: { game: Game | null }) {
  const router = useRouter();
  const handleClick = () => {
    if (!game) return;
    router.push(`/game-model?gameId=${game.id}`);
  };

  const percent = game ? Math.round(game.syncScore * 100) : 0;

  if (!game) {
    return (
      <div className="text-center text-[var(--text-dim)] text-sm mt-4">
        No game data available
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="relative w-full rounded-lg border border-white/10 bg-[rgba(10,14,22,0.75)] backdrop-blur-md px-4 py-4">

        <div className="flex flex-col gap-2">

          {/* MATCHUP */}
          <div className="flex items-center justify-center gap-4 text-h3">

            <img
              src={`https://a.espncdn.com/i/teamlogos/nba/500/${game.awayTeam.toLowerCase()}.png`}
              alt={game.awayTeam}
              className="w-9 h-9 object-contain"
            />

            <span>
              {game.awayTeam} vs {game.homeTeam}
            </span>

            <img
              src={`https://a.espncdn.com/i/teamlogos/nba/500/${game.homeTeam.toLowerCase()}.png`}
              alt={game.homeTeam}
              className="w-9 h-9 object-contain"
            />

          </div>

          {/* TIME */}
          <div className="text-center text-[11px] text-[var(--text-muted)]">
            {game.time}
          </div>

          {/* METRICS */}
          <div className="mt-2 grid grid-cols-3 text-center gap-2">

            {/* TOP PLAYER */}
            <div>
              <div className="text-[9px] tracking-[0.08em] text-[var(--text-dim)]">
                GAME SYNC
              </div>
              <div className="text-[9px] text-[var(--text-dim)] mb-0.5">
                signal density
              </div>
              <div className="text-[20px] font-medium text-[var(--accent-cyan)]">
                {percent}%              </div>
            </div>

            {/* TOTAL SIGNALS */}
            <div>
              <div className="text-[9px] tracking-[0.08em] text-[var(--text-dim)]">
                TOTAL SIGNAL HITS
              </div>
              <div className="text-[9px] text-[var(--text-dim)] mb-0.5">
                all players in game
              </div>
              <div className="text-[20px] font-medium text-[var(--accent-purple)]">
                {game.totalSignals}
              </div>
            </div>

            {/* PLAYERS */}
            <div>
              <div className="text-[9px] tracking-[0.08em] text-[var(--text-dim)]">
                PLAYERS ANALYZED
              </div>
              <div className="text-[9px] text-[var(--text-dim)] mb-0.5">
                total sample size
              </div>
              <div className="text-[20px] font-medium text-[var(--accent-orange)]">
                {game.activePlayers}
              </div>
            </div>

          </div>

          {/* SIGNAL BAR */}
          <div className="mt-3 h-[6px] w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${percent}%`,
                background:
                  "linear-gradient(90deg, var(--accent-cyan), var(--accent-purple), var(--accent-orange))",
              }}
            />
          </div>

          {/* BUTTON */}
          <div className="mt-4">
            <ButtonPrimary onClick={handleClick}>
              View Full Analysis
            </ButtonPrimary>
          </div>

        </div>
      </div>
    </div>
  );
}