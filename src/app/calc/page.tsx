"use client";

import { useState } from "react";
import FooterNav from "../../components/FooterNav";
import { computeDateNumerology } from "../../engine/dateNumerology";
import { computeGematria } from "../../engine/gematria";
import ButtonPrimary from "../../components/ui/ButtonPrimary";

// ======================================================
// HELPERS
// ======================================================

// PST DATE (SOURCE OF TRUTH)
function getTodayPST(): string {
  const now = new Date();

  const pst = new Date(
    now.toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
    })
  );

  const year = pst.getFullYear();
  const month = String(pst.getMonth() + 1).padStart(2, "0");
  const day = String(pst.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// REDUCE (DISPLAY ONLY)
function reduce(n: number): number {
  while (n > 9) {
    n = n
      .toString()
      .split("")
      .reduce((a, b) => a + Number(b), 0);
  }
  return n;
}

// ======================================================
// PAGE
// ======================================================

export default function CalcPage() {
  const [date, setDate] = useState(getTodayPST());
  const [word, setWord] = useState("");
  const [gematria, setGematria] = useState<ReturnType<typeof computeGematria> | null>(null);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [diff, setDiff] = useState<number | null>(null);

  const numbers = computeDateNumerology(date);

  const handleGematria = () => {
    if (!word) return;
    setGematria(computeGematria(word));
  };

  const handleDiff = () => {
    if (!fromDate || !toDate) return;

    const d1 = new Date(fromDate);
    const d2 = new Date(toDate);

    const days = Math.abs(
      Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24))
    );

    setDiff(days);
  };

  return (
  <div className="min-h-screen bg-black text-white">

    <div className="w-full max-w-[420px] mx-auto px-3 pb-28">

      {/* TITLE */}
      <div className="mt-2 text-[10px] tracking-[0.08em] text-[var(--text-dim)] px-1">
        CALCULATOR
      </div>

      {/* ================= DATE NUMEROLOGY ================= */}
      <div className="mt-3 rounded-lg border border-white/10 bg-[rgba(10,14,22,0.75)] backdrop-blur-md px-4 py-4">

        <div className="text-[9px] tracking-[0.08em] text-[var(--text-dim)] mb-2">
          DATE NUMEROLOGY
        </div>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full mb-3 rounded-md bg-white/[0.03] border border-white/10 px-3 py-2 text-[13px]"
        />

        <div className="grid grid-cols-3 gap-2 text-center">

          <div>
            <div className="text-[20px] text-[var(--accent-orange)]">{numbers.dom}</div>
            <div className="text-[9px] text-[var(--text-dim)]">DOM</div>
          </div>

          <div>
            <div className="text-[20px] text-[var(--accent-cyan)]">{numbers.row1_fullSum}</div>
            <div className="text-[9px] text-[var(--text-dim)]">FULL</div>
          </div>

          <div>
            <div className="text-[20px] text-[var(--accent-purple)]">{numbers.row2_mixedYearDigits}</div>
            <div className="text-[9px] text-[var(--text-dim)]">MIXED</div>
          </div>

          <div>
            <div>{numbers.row3_fullDigits}</div>
            <div className="text-[9px] text-[var(--text-dim)]">DIGITS</div>
          </div>

          <div>
            <div>{numbers.row4_shortYear}</div>
            <div className="text-[9px] text-[var(--text-dim)]">SHORT</div>
          </div>

          <div>
            <div>{numbers.row5_shortDigits}</div>
            <div className="text-[9px] text-[var(--text-dim)]">SHORT DIGITS</div>
          </div>

        </div>

        <div className="mt-3 text-[10px] text-[var(--text-dim)]">
          Components: {numbers.allComponents.join(" • ")}
        </div>

        <div className="text-[10px] text-[var(--text-dim)]">
          Primes: {numbers.primeComponents.join(" • ") || "None"}
        </div>

        <div className="text-[10px] text-[var(--text-dim)]">
          Masters: {numbers.masterCandidates.join(" • ") || "None"}
        </div>

      </div>

      {/* ================= GEMATRIA ================= */}
      <div className="mt-4 rounded-lg border border-white/10 bg-[rgba(10,14,22,0.75)] backdrop-blur-md px-4 py-4">

        <div className="text-[9px] tracking-[0.08em] text-[var(--text-dim)] mb-2">
          GEMATRIA
        </div>

        <input
          type="text"
          placeholder="Enter word..."
          value={word}
          onChange={(e) => setWord(e.target.value)}
          className="w-full rounded-md bg-white/[0.03] border border-white/10 px-3 py-2 text-[13px]"
        />

        <div className="mt-3">
          <ButtonPrimary onClick={handleGematria}>
            Calculate
          </ButtonPrimary>
        </div>

        {gematria && (
          <div className="mt-4 text-[13px]">

            <div className="text-[22px] text-[var(--accent-cyan)] font-medium">
              {gematria.value}
            </div>

            <div className="mt-2 text-[10px] text-[var(--text-dim)] font-mono">
              {gematria.breakdown.map((c, i) => (
                <span key={i} className="mr-2">
                  {c.char}:{c.value}
                </span>
              ))}
            </div>

            <div className="mt-2 text-[10px] text-[var(--text-dim)]">
              Reduced: {reduce(gematria.value)}
            </div>

          </div>
        )}

      </div>

      {/* ================= DATE DIFFERENCE ================= */}
      <div className="mt-4 rounded-lg border border-white/10 bg-[rgba(10,14,22,0.75)] backdrop-blur-md px-4 py-4">

        <div className="text-[9px] tracking-[0.08em] text-[var(--text-dim)] mb-2">
          DATE DIFFERENCE
        </div>

        <div className="flex gap-2">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full rounded-md bg-white/[0.03] border border-white/10 px-2 py-2 text-[13px]"
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full rounded-md bg-white/[0.03] border border-white/10 px-2 py-2 text-[13px]"
          />
        </div>

        <div className="mt-3">
          <ButtonPrimary onClick={handleDiff}>
            Calculate
          </ButtonPrimary>
        </div>

        {diff !== null && (
          <div className="mt-4 text-center">

            <div className="text-[22px] text-[var(--accent-orange)] font-medium">
              {diff} DAYS
            </div>

            <div className="text-[10px] text-[var(--text-dim)]">
              Reduced: {reduce(diff)}
            </div>

          </div>
        )}

      </div>

    </div>

    <FooterNav />
  </div>
);
}