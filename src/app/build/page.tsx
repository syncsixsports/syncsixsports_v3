"use client";

import { useState } from "react";
import ButtonPrimary from "../../components/ui/ButtonPrimary";

type Pick = {
  id: string;
  player: string;
  detail: string;
  confidence: number;
};

const INITIAL_PICKS: Pick[] = [
  { id: "1", player: "R. Anderson", detail: "Over 22.5 Points", confidence: 91 },
  { id: "2", player: "J. Reed", detail: "Over 3.5 3PM", confidence: 88 },
  { id: "3", player: "T. Collins", detail: "Under 7.5 Rebounds", confidence: 84 },
  { id: "4", player: "D. Owens", detail: "Over 1.5 TDs", confidence: 89 },
  { id: "5", player: "A. Vale", detail: "Over 8.5 Assists", confidence: 86 },
];

export default function BuildPage() {
  const [pool, setPool] = useState(INITIAL_PICKS);
  const [card, setCard] = useState<Pick[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  const addToCard = (pick: Pick) => {
    setPool((prev) => prev.filter((p) => p.id !== pick.id));
    setCard((prev) => [...prev, pick]);
  };

  const removeFromCard = (pick: Pick) => {
    setCard((prev) => prev.filter((p) => p.id !== pick.id));
    setPool((prev) => [...prev, pick]);
  };

  const avgConf =
    card.length > 0
      ? Math.round(card.reduce((a, b) => a + b.confidence, 0) / card.length)
      : 0;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="w-full max-w-[420px] mx-auto px-3 pb-24">

        {/* HEADER */}
        <div className="mt-2 text-[10px] tracking-[0.08em] text-[var(--text-dim)]">
          BUILD
        </div>

        {/* ================= PICKS POOL ================= */}
        <div className="mt-3 rounded-lg border border-white/10 bg-[rgba(10,14,22,0.75)] backdrop-blur-md p-4">

          <div className="flex justify-between items-center mb-2">
            <div className="text-[10px] tracking-[0.08em] text-[var(--text-dim)]">
              PICKS POOL
            </div>
            <div className="text-[11px] text-[var(--text-muted)]">
              {pool.length} PICKS
            </div>
          </div>

          <div className="max-h-[260px] overflow-y-auto space-y-2">

            {pool.map((p) => {
              const open = openId === p.id;

              return (
                <div
                  key={p.id}
                  className="border border-white/10 rounded-md bg-white/[0.03]"
                >

                  {/* ROW */}
                  <div className="flex justify-between items-center px-3 py-2">

                    {/* LEFT (clickable) */}
                    <div
                      className="cursor-pointer"
                      onClick={() => setOpenId(open ? null : p.id)}
                    >
                      <div className="text-[13px] font-medium">{p.player}</div>
                      <div className="text-[10px] text-[var(--text-dim)]">
                        {p.detail}
                      </div>
                    </div>

                    {/* RIGHT (action only) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCard(p);
                      }}
                      className="text-[11px] text-[var(--accent-cyan)]"
                    >
                      + Add
                    </button>

                  </div>

                  {/* EXPANDED */}
                  {open && (
                    <div className="px-3 pb-3 pt-1 text-[11px] text-[var(--text-dim)] border-t border-white/5">
                      Confidence: {p.confidence}%
                      <div className="mt-2">
                        <button
                          onClick={() => addToCard(p)}
                          className="text-[var(--accent-cyan)] text-[11px]"
                        >
                          Add to Card
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}

          </div>
        </div>

        {/* ================= ACTIVE CARD ================= */}
        <div className="mt-4 rounded-lg border border-[var(--accent-cyan)]/20 bg-[rgba(10,14,22,0.85)] backdrop-blur-md p-4">

          <div className="flex justify-between items-center mb-2">
            <div className="text-[10px] tracking-[0.08em] text-[var(--text-dim)]">
              ACTIVE CARD
            </div>
            <div className="text-[11px] text-[var(--accent-cyan)]">
              {avgConf}% CONF
            </div>
          </div>

          {card.length === 0 ? (
            <div className="text-center text-[12px] text-[var(--text-dim)] py-6">
              No picks selected
            </div>
          ) : (
            <div className="space-y-2">

              {card.map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between items-center px-3 py-2 rounded-md bg-white/[0.03] border border-white/5"
                >
                  <div>
                    <div className="text-[13px] font-medium">{p.player}</div>
                    <div className="text-[10px] text-[var(--text-dim)]">
                      {p.detail}
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCard(p)}
                    className="text-[10px] text-red-400"
                  >
                    Remove
                  </button>
                </div>
              ))}

            </div>
          )}

          {/* METRICS */}
          <div className="mt-3 grid grid-cols-3 text-center">

            <div>
              <div className="text-[18px] text-[var(--accent-orange)]">
                {card.length}
              </div>
              <div className="text-[9px] text-[var(--text-dim)]">PICKS</div>
            </div>

            <div>
              <div className="text-[18px] text-[var(--accent-green)]">
                {avgConf}%
              </div>
              <div className="text-[9px] text-[var(--text-dim)]">CONF</div>
            </div>

            <div>
              <div className="text-[18px] text-[var(--accent-cyan)]">
                {card.length >= 3 ? "5x" : "--"}
              </div>
              <div className="text-[9px] text-[var(--text-dim)]">PAYOUT</div>
            </div>

          </div>

          {/* CTA */}
          <div className="mt-4">
            <ButtonPrimary>
              Place Bet
            </ButtonPrimary>
          </div>

        </div>

      </div>
    </div>
  );
}