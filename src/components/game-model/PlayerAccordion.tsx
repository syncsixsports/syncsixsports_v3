"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Card from "../ui/Card";
import type { GameModelPlayer } from "./types";

type Props = {
  players: GameModelPlayer[];
  expandedId: number | null;
  selectedIds: number[];
  onExpand: (id: number) => void;
  onToggleAdd: (player: GameModelPlayer) => void;
};

function Tag({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.15em] text-white/65">
      {label}
    </span>
  );
}

export default function PlayerAccordion({
  players,
  expandedId,
  selectedIds,
  onExpand,
  onToggleAdd,
}: Props) {

  const router = useRouter();
  return (
    <Card variant="strong" padding="sm" className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-2 pb-2 pt-1">
        <div>
          <h2 className="text-h3">Player Signals</h2>
          <p className="text-body text-xs">Primary decision engine</p>
        </div>

        <div className="text-label">
          Tap to Expand
        </div>
      </div>

      {/* List */}
      <div className="no-scrollbar min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
        {players.map((player) => {
          const isExpanded = expandedId === player.id;
          const isAdded = selectedIds.includes(player.id);

          return (
            <div
              key={player.id}
              className={[
                "overflow-hidden rounded-[var(--radius-md)] border transition-all duration-200",
                isExpanded
                  ? "border-cyan-300/20 bg-white/[0.06]"
                  : "border-white/10 bg-white/[0.04]",
              ].join(" ")}
            >
              {/* Top Row */}
              <button
                type="button"
                onClick={() => onExpand(player.id)}
                className="w-full px-3 py-3 text-left transition hover:bg-white/[0.03] active:scale-[0.995]"
              >
                <div className="flex items-center gap-3">

                  {/* HEADSHOT */}
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/5">
                    {player.headshot ? (
                      <Image
                        src={player.headshot}
                        alt={player.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] text-white/40">
                        N/A
                      </div>
                    )}
                  </div>

                  {/* MAIN INFO */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">

                      {/* NAME + TAGS */}
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-white">
                          {player.name}
                        </div>
                      </div>

                      {/* SYNC */}
                      <div className="shrink-0 text-right">
                        <div className="text-[10px] uppercase tracking-wide text-white/40">
                          Sync
                        </div>
                        <div className="text-lg font-bold text-cyan-300 leading-none">
                          {player.syncPercent}%
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              </button>

              {/* Expanded */}
              <div
                className="grid transition-[grid-template-rows,opacity] duration-300 ease-out"
                style={{
                  gridTemplateRows: isExpanded ? "1fr" : "0fr",
                  opacity: isExpanded ? 1 : 0.4,
                }}
              >
                <div className="overflow-hidden">
                  <div className="border-t border-white/10 px-3 pb-3 pt-3">

                    <div className="space-y-4 rounded-[var(--radius-md)] border border-white/10 bg-white/[0.05] p-3">


                      {/* =======================
    RECENT FORM
======================= */}
                      {player.last5 && (
                        <div className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2">
                          <div className="text-[10px] uppercase tracking-wide text-white/40">
                            Last 5 Games
                          </div>

                          <div className="mt-1 flex justify-between text-xs text-white/80">
                            <span>{player.last5.avgPoints} PTS</span>
                            <span>{player.last5.avgRebounds} REB</span>
                            <span>{player.last5.avgAssists} AST</span>
                          </div>
                        </div>
                      )}
                      {/* =======================
            PROP
        ======================= */}
                      <div>
                        <div className="text-[10px] uppercase tracking-wide text-white/40">
                          Prop
                        </div>

                        <div className="mt-1 text-sm font-semibold text-white">
                          {player.prop || "No prop available"}
                        </div>
                      </div>

                      {/* =======================
            SYNC + HITS
        ======================= */}
                      <div className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.04] px-3 py-2">
                        <div className="text-[11px] text-white/50">
                          Signal Strength
                        </div>

                        <div className="text-sm font-semibold text-cyan-300">
                          {player.syncPercent}% · {player.hits} hits
                        </div>
                      </div>

                      {/* =======================
            BREAKDOWN
        ======================= */}
                      <div>
                        <div className="text-[10px] uppercase tracking-wide text-white/40 mb-2">
                          Why It Hits
                        </div>

                        <div className="space-y-2">
                          {player.breakdown.length > 0 ? (
                            player.breakdown.map((line, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-2 text-xs leading-relaxed text-white/70"
                              >
                                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                                <span>{line}</span>
                              </div>
                            ))
                          ) : (
                            <div className="text-xs text-white/40">
                              No active signals
                            </div>
                          )}
                        </div>
                      </div>

                      {/* =======================
        {/* =======================
    CONTEXT (LIGHT)
======================= */}
                      <div className="flex flex-wrap gap-3 text-[11px] text-white/50">

                        {player.position && (
                          <span>{player.position}</span>
                        )}

                        {player.age != null && player.age > 0 && (
                          <span>Age {player.age}</span>
                        )}

                        {player.experienceYears != null && player.experienceYears > 0 && (
                          <span>{player.experienceYears} yrs exp</span>
                        )}

                      </div>

                      {/* =======================
            CTA
        ======================= */}
                      <button
                        type="button"
                        onClick={() => onToggleAdd(player)}
                        className={[
                          "mt-2 w-full rounded-md px-4 py-3 text-sm font-medium transition-all duration-200 active:scale-[0.98]",
                          isAdded
                            ? "bg-emerald-400/20 border border-emerald-300/30 text-emerald-200"
                            : "bg-cyan-400/10 border border-cyan-300/30 text-cyan-100 hover:bg-cyan-400/20",
                        ].join(" ")}
                      >
                        {isAdded ? "Added to Build ✓" : "Add to Build"}
                      </button>

                      <button
                        onClick={() => router.push(`/player/${player.id}`)}
                        className={[
                          "mt-2 w-full rounded-md px-4 py-3 text-sm font-medium transition-all duration-200 active:scale-[0.98]",
                          "bg-white/5 border border-white/10 text-white hover:bg-white/10",
                        ].join(" ")}
                      >
                        VIEW FULL PROFILE →
                      </button>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}