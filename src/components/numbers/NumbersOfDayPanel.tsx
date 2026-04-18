"use client";

import ButtonPrimary from "../ui/ButtonPrimary";

type Match = {
  name: string;
  value: number;
  matchedTo: string;
};

type Data = {
  dom: number;
  coreNumbers: number[];
  matches: Match[];
  signalStrength: "strong" | "moderate" | "weak";
};

export default function NumbersOfDayPanel({ data }: { data: Data }) {
  if (!data) return null;

  const { dom, coreNumbers, matches, signalStrength } = data;

  return (
    <div className="mt-6">

      {/* HEADER */}
      <div className="text-[10px] tracking-[0.08em] text-[var(--text-dim)] mb-2 px-1">
        NUMBERS OF THE DAY
      </div>

      {/* PANEL */}
      <div className="rounded-lg border border-white/10 bg-[rgba(10,14,22,0.75)] backdrop-blur-md px-4 py-4">

        <div className="flex flex-col gap-3">

          {/* =====================
              DOM + CORE
          ===================== */}
          <div className="flex items-center gap-3">

            {/* DOM (stat style, not box) */}
            <div className="flex flex-col items-center justify-center px-3 py-2 rounded-md border border-[var(--accent-orange)]/40 bg-[var(--accent-orange)]/10 min-w-[72px]">
              <div className="text-[22px] font-semibold text-[var(--accent-orange)] leading-none">
                {dom}
              </div>
              <div className="text-[9px] tracking-[0.08em] text-[var(--text-dim)]">
                DOM
              </div>
            </div>

            {/* CORE STACK (data strip, not card) */}
            <div className="flex-1 px-3 py-2 rounded-md border border-white/5 bg-white/[0.03] text-center">

              <div className="text-[9px] tracking-[0.08em] text-[var(--text-dim)] mb-1">
                CORE STACK
              </div>

              <div className="text-[13px] font-medium">
                <span className="text-white">
                  {coreNumbers[0]}
                </span>
                <span className="text-[var(--text-dim)]">
                  {" • " + coreNumbers.slice(1).join(" • ")}
                </span>
              </div>

            </div>

          </div>

          {/* =====================
              GEMATRIA MATCHES
          ===================== */}
          <div>

            <div className="text-[9px] tracking-[0.08em] text-[var(--text-dim)] mb-2">
              GEMATRIA MATCHES
            </div>

            <div className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 space-y-1.5">

              {matches.length > 0 ? (
                matches.map((m, i) => (
                  <div key={i} className="text-[13px] text-white/80">
                    <span className="text-white font-medium">{m.name}</span>
                    <span className="text-[var(--text-dim)]"> → </span>
                    <span className="text-[var(--accent-cyan)]">{m.value}</span>
                    <span className="text-[var(--text-dim)]"> matches </span>
                    <span className="text-[var(--accent-orange)]">{m.matchedTo}</span>
                  </div>
                ))
              ) : (
                <div className="text-[12px] text-[var(--text-dim)]">
                  No player alignment with core numbers
                </div>
              )}

            </div>

            {/* INSIGHT */}
            <div className="text-[10px] text-[var(--text-dim)] mt-2 text-center">
              {matches.length > 0
                ? `Alignment across ${matches.length} player${matches.length > 1 ? "s" : ""}`
                : `Low alignment across today's slate`}
            </div>

          </div>

          {/* =====================
              SIGNAL STRENGTH
          ===================== */}
          <div className="flex justify-center">

            <div className={`
              text-[11px] px-3 py-1 rounded-md border
              ${signalStrength === "strong" && "text-[var(--accent-green)] border-[var(--accent-green)]/40 bg-[var(--accent-green)]/10"}
              ${signalStrength === "moderate" && "text-[var(--accent-orange)] border-[var(--accent-orange)]/40 bg-[var(--accent-orange)]/10"}
              ${signalStrength === "weak" && "text-[var(--text-dim)] border-white/10 bg-white/5"}
            `}>
              {signalStrength.toUpperCase()} SIGNAL
            </div>

          </div>

          {/* =====================
              CTA
          ===================== */}
          <div className="mt-2">
            <ButtonPrimary>
              Open Calculator
            </ButtonPrimary>
          </div>

        </div>
      </div>
    </div>
  );
}