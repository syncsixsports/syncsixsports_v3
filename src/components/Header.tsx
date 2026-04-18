"use client";
import Image from "next/image";

import { useState } from "react";

// ======================================================
// FORMAT DATE LABEL
// ======================================================
function formatDateLabel(date: Date) {
  const month = date
    .toLocaleString("en-US", { month: "short" })
    .toUpperCase();

  const day = date.getDate();

  return `${month} ${day}`;
}

// ======================================================
// HEADER COMPONENT
// ======================================================
export default function Header({
  onDateChange,
}: {
  onDateChange: (date: string) => void;
}) {
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();

    return new Date(
      now.toLocaleString("en-US", {
        timeZone: "America/Los_Angeles",
      })
    );
  });

  const updateDate = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + offset);

    setCurrentDate(newDate);

    const iso = newDate.toISOString().split("T")[0];
    onDateChange(iso);
  };

  const label = formatDateLabel(currentDate);

  return (
    <div className="w-full max-w-[420px] mx-auto px-3 pt-4 pb-3">
      {/* ===================== */}
      {/* ROW 1 — BRAND */}
      {/* ===================== */}
      <div className="flex items-center justify-between relative">

        {/* LEFT — BRAND TEXT */}
        <div className="
      text-lg font-semibold tracking-wide
      bg-gradient-to-r
      from-purple-400
      via-pink-500
      to-purple-500
      bg-clip-text
      text-transparent
      drop-shadow-[0_0_8px_rgba(168,85,247,0.35)]
    ">
          Sync6
        </div>

        {/* CENTER — LOGO (absolute center lock) */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <div className="
        w-10 h-10
        rounded-full
        border border-purple-400/30
        bg-gradient-to-br from-[#0b0b12] to-[#050507]
        flex items-center justify-center
        shadow-[0_0_12px_rgba(168,85,247,0.35)]
        overflow-hidden
      ">
            <Image
              src="/assets/logo.png"
              alt="Sync6 Logo"
              width={40}
              height={40}
              className="object-contain scale-90 opacity-90"
              priority
            />
          </div>
        </div>

        {/* RIGHT — AUTH BUTTON */}
        <div>
          <button className="
        px-4 py-1.5
        rounded-full
        border border-purple-400/40
        text-sm font-medium
        text-purple-300
        bg-transparent
        backdrop-blur-md
        hover:bg-purple-500/10
        hover:border-purple-400/70
        transition-all duration-200
      ">
            Create / Login
          </button>
        </div>

      </div>


      {/* ===================== */}
      {/* ROW 2 — CONTEXT BAR */}
      {/* ===================== */}
      <div className="mt-4 flex items-center justify-between gap-2">
        {/* SPORT */}
        <div className="
          flex items-center gap-2
          px-3 py-2
          rounded-xl
          border border-cyan-400/20
          bg-cyan-500/5
          text-sm text-white/80
        ">
          🏀
          <span>NBA</span>
          <span className="text-white/40">▾</span>
        </div>

        {/* DATE CONTROL */}
        <div className="
          flex items-center gap-3
          px-4 py-2
          rounded-xl
          border border-white/10
          bg-white/5
          text-sm text-white/80
        ">
          <button
            onClick={() => updateDate(-1)}
            className="text-white/40 hover:text-white transition"
          >
            ‹
          </button>

          <span className="tracking-wide">{label}</span>

          <button
            onClick={() => updateDate(1)}
            className="text-white/40 hover:text-white transition"
          >
            ›
          </button>
        </div>

        {/* AI */}
        <div className="
          flex items-center gap-2
          px-3 py-2
          rounded-xl
          border border-cyan-400/30
          bg-cyan-500/10
          text-xs tracking-wide
          text-cyan-300
        ">
          <span>AI ON</span>
          <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
        </div>
      </div>
    </div>
  );
}