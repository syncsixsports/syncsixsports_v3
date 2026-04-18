"use client";

import { useRouter } from "next/navigation";
import ButtonPrimary from "./ui/ButtonPrimary";

type Player = {
  playerId: string;
  name: string;
  team: string;
  opponent: string;
  score: number;
  reasons: string[];
  headshot: string;
  hits: number;
};

export default function TopPlayCard({ player }: { player: Player }) {
  const router = useRouter();
  const percent = Math.round((player.hits / 11) * 100);

  return (
    <div className="w-full">
      <div className="relative w-full rounded-lg border border-white/10 bg-[rgba(10,14,22,0.75)] backdrop-blur-md px-4 py-4">

        <div className="flex flex-col gap-3">

          {/* TOP ROW */}
          <div className="flex items-center justify-between">

            {/* LEFT */}
            <div className="flex items-center gap-3">

              {/* HEADSHOT */}
              {player.headshot ? (
                <img
                  src={player.headshot}
                  alt={player.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/50">
                  N/A
                </div>
              )}

              {/* NAME + MATCHUP */}
              <div>
                <div className="text-h3">
                  {player.name}
                </div>
                <div className="text-body">
                  {player.team} vs {player.opponent}
                </div>
              </div>

            </div>

            {/* SCORE */}
            <div className="px-2.5 py-1 rounded-md border border-white/10 glow-cyan text-center">
              <div className="text-[10px] text-[var(--text-muted)] leading-none">
                SCORE
              </div>
              <div className="text-[28px] font-semibold text-[var(--accent-cyan)] leading-none">
                {percent}%
              </div>
            </div>

          </div>

          {/* TAGS */}
          <div className="flex flex-wrap justify-center gap-1.5">
            {player.reasons.slice(0, 2).map((reason, i) => (
              <div
                key={i}
                className="px-2 py-0.5 text-[10px] border border-white/10 rounded text-[var(--text-muted)]"
              >
                {reason.replaceAll("_", " ")}
              </div>
            ))}
          </div>

          {/* SIGNAL COUNT */}
          <div className="text-center text-[11px] text-[var(--text-dim)]">
            {player.hits} signals detected
          </div>

          {/* SIGNAL BAR */}
          <div className="h-[6px] w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--accent-cyan)] rounded-full"
              style={{ width: `${percent}%` }}
            />
          </div>

          {/* CTA */}
          <div className="mt-3 text-center">
            <div className="mt-4">
              <div className="mt-4">
  <ButtonPrimary
    tone="neutral"
    onClick={() => router.push(`/player/${player.playerId}`)}
  >
    View Full Profile
  </ButtonPrimary>
</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}