"use client";

import { useBuildStore } from "../lib/buildStore";

export default function QuickBuildPanel({
  open,
}: {
  open: boolean;
}) {
  const players = useBuildStore((s) => s.players);

  const confidence =
    players.length === 0
      ? 0
      : Math.round(
          players.reduce((sum, p) => sum + p.syncPercent, 0) /
            players.length
        );

  return (
    <>
      {/* BACKDROP */}
      <div
        className={`
          fixed inset-0 z-40
          bg-black/40 backdrop-blur-sm
          transition-opacity duration-300
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      />

      {/* PANEL */}
      <div
        className={`
          fixed bottom-0 left-0 right-0 z-50
          flex justify-center
          transition-transform duration-300 ease-out
          ${open ? "translate-y-0" : "translate-y-full"}
        `}
      >
        <div
          className="
            w-full max-w-[420px]
            rounded-t-3xl
            border border-white/10
            bg-gradient-to-b from-[#0b0f1a] to-[#05070d]
            backdrop-blur-xl
            px-4 pt-3 pb-4
            shadow-[0_-10px_40px_rgba(0,0,0,0.6)]
          "
          style={{
            height: "20vh", // 👈 THIS IS YOUR 20% PANEL
            minHeight: "160px",
          }}
        >
          {/* HANDLE */}
          <div className="flex justify-center mb-3">
            <div className="h-1 w-10 rounded-full bg-white/20" />
          </div>

          {/* HEADER */}
          <div className="flex justify-between items-center mb-3">
            <div className="text-xs text-white/40">
              Build • {players.length} Picks
            </div>
            <div className="text-xs text-cyan-300">
              {confidence}% Conf
            </div>
          </div>

          {/* CONTENT */}
          <div className="overflow-y-auto pr-1 max-h-[calc(20vh-70px)]">
            {players.length === 0 ? (
              <div className="text-sm text-white/50">
                No picks added
              </div>
            ) : (
              <div className="space-y-2">
                {players.map((p) => (
                  <div
                    key={p.id}
                    className="
                      flex justify-between items-center
                      text-sm text-white
                      border border-white/5
                      bg-white/[0.03]
                      rounded-xl px-3 py-2
                    "
                  >
                    <span className="truncate">{p.name}</span>
                    <span className="text-cyan-300 ml-2">
                      {p.syncPercent}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}