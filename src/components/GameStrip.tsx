"use client";

import Link from "next/link";

type Game = {
  id: number;
  homeTeam: string;
  awayTeam: string;
  time: string;
  syncScore: number;
  totalSignals: number;
};

export default function GameStrip({ games }: { games: Game[] }) {
  if (!games || games.length === 0) return null;

  return (
    <div className="mt-6">
      {/* =====================
          SECTION TITLE
      ===================== */}
      <p className="text-xs text-gray-400 tracking-wide mb-3 px-1">
        GAMES TODAY
      </p>

      {/* =====================
          SCROLL STRIP
      ===================== */}
      <div className="flex gap-4 overflow-x-auto pb-3 no-scrollbar">
        {games.map((game) => {
          const awayLogo = `https://a.espncdn.com/i/teamlogos/nba/500/${game.awayTeam.toLowerCase()}.png`;
          const homeLogo = `https://a.espncdn.com/i/teamlogos/nba/500/${game.homeTeam.toLowerCase()}.png`;

          const percent = Math.round(game.syncScore * 100);

          return (
            <Link key={game.id} href={`/game/${game.id}?gameId=${game.id}`}>
              <div className="relative min-w-[190px] h-[120px] rounded-2xl overflow-hidden border border-white/10 flex-shrink-0 group cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition">

                {/* LEFT (AWAY) */}
                <div className="absolute inset-y-0 left-0 w-1/2 bg-black/60">
                  <img
                    src={awayLogo}
                    alt={game.awayTeam}
                    className="absolute inset-0 w-full h-full object-cover opacity-20 scale-110 blur-sm"
                  />
                </div>

                {/* RIGHT (HOME) */}
                <div className="absolute inset-y-0 right-0 w-1/2 bg-black/60">
                  <img
                    src={homeLogo}
                    alt={game.homeTeam}
                    className="absolute inset-0 w-full h-full object-cover opacity-20 scale-110 blur-sm"
                  />
                </div>

                {/* CENTER DIVIDER */}
                <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-white/10" />

                {/* CONTENT */}
                <div className="absolute inset-0 p-3 flex flex-col justify-between backdrop-blur-md bg-black/40">

                  <div className="flex items-center justify-between">
                    <img src={awayLogo} alt={game.awayTeam} className="w-6 h-6 object-contain" />
                    <span className="text-xs text-white/70 tracking-wide">VS</span>
                    <img src={homeLogo} alt={game.homeTeam} className="w-6 h-6 object-contain" />
                  </div>

                  <div className="text-center">
                    <div className="text-sm font-semibold text-white tracking-tight">
                      {game.awayTeam} vs {game.homeTeam}
                    </div>
                    <div className="text-[10px] text-white/50 mt-0.5">
                      {game.time}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/40 tracking-wide">SYNC</span>

                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-cyan-400">
                        {percent}%
                      </span>
                      <span className="text-[10px] text-white/40">
                        • {game.totalSignals} signals
                      </span>
                    </div>
                  </div>

                  <div className="h-[2px] w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-orange-400"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                </div>

                {/* HOVER */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-white/5" />

              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}






