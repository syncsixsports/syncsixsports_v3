"use client";

import { getPlayerById } from "../../../lib/playerStore";
import { useParams } from "next/navigation";

export default function PlayerProfilePage() {
  const params = useParams();
  const id = params.id as string;

  const rawPlayer = getPlayerById(id);

  console.log("PLAYER PROFILE RAW:", rawPlayer);

  // 🚫 fallback (important for now)
  if (!rawPlayer) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Player not found
      </div>
    );
  }

  // 🎯 map engine → UI shape
  const player = {
    id: rawPlayer.playerId || rawPlayer.id,
    name: rawPlayer.name,
    team: rawPlayer.team,
    opponent: rawPlayer.opponent,
    sync: rawPlayer.sync || rawPlayer.score * 10,

    headshot: rawPlayer.headshot,

    age: rawPlayer.age,
    position: rawPlayer.position,
    height: rawPlayer.height,
    college: rawPlayer.college,

    last5: rawPlayer.last5,
    reasons: rawPlayer.reasons || [],
  };

  return (
  <div className="min-h-screen bg-black text-white relative overflow-x-hidden">

    {/* =====================
        GLOBAL BACKGROUND SYSTEM
    ===================== */}
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[300px] w-[300px] rounded-full bg-[#dbf93a]/10 blur-[120px]" />
      <div className="absolute top-[240px] left-1/2 -translate-x-1/2 h-[420px] w-[420px] rounded-full bg-cyan-400/5 blur-[140px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_40%)]" />
    </div>

    <div className="relative mx-auto flex w-full max-w-md flex-col items-center px-4 pt-10 pb-28">

      {/* =====================
          HERO
      ===================== */}
      <div className="relative flex flex-col items-center w-full mt-4">

        {/* AURA */}
        <div className="absolute w-[280px] h-[280px] rounded-full bg-[#dbf93a]/10 blur-[120px]" />

        {/* RING STACK */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-56 h-56 rounded-full border border-[#dbf93a]/20 blur-sm" />
          <div className="absolute w-52 h-52 rounded-full border-[3px] border-[#dbf93a]/70 shadow-[0_0_30px_rgba(219,249,58,0.2)]" />

          <img
            src={player.headshot}
            alt={player.name}
            className="w-44 h-44 rounded-full object-cover z-10 shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
          />
        </div>

        {/* TEXT */}
        <div className="text-center mt-6 space-y-2">

          <h1 className="text-[26px] font-semibold tracking-tight">
            {player.name}
          </h1>

          <p className="text-white/50 text-sm tracking-wide">
            {player.team} vs {player.opponent}
          </p>

          {/* SYNC BADGE */}
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#dbf93a]/10 border border-[#dbf93a]/30 shadow-[0_0_20px_rgba(219,249,58,0.15)]">
            <div className="w-2 h-2 rounded-full bg-[#dbf93a]" />
            <span className="text-[#dbf93a] text-sm font-medium tracking-wide">
              {player.sync}% SYNC
            </span>
          </div>

        </div>
      </div>

      {/* =====================
          PLAYER DATA (CONDENSED PREMIUM)
      ===================== */}
      <div className="w-full mt-6">

        <div className="
          rounded-2xl
          border border-white/10
          bg-[linear-gradient(180deg,rgba(15,18,28,0.92),rgba(10,12,18,0.75))]
          backdrop-blur-xl
          px-4 py-4
          shadow-[0_0_40px_rgba(0,0,0,0.8)]
        ">

          <div className="text-[10px] tracking-[0.25em] text-white/30 uppercase mb-3">
            Player Data
          </div>

          <div className="grid grid-cols-3 gap-y-4 gap-x-3">

            {[
              { label: "Age", value: player.age },
              { label: "Exp", value: rawPlayer.experienceYears },
              { label: "Pos", value: typeof player.position === "string"
                  ? player.position
                  : player.position?.abbreviation },

              { label: "Height", value: player.height },
              { label: "College", value: typeof player.college === "string"
                  ? player.college
                  : player.college?.name },
              { label: "Draft", value: rawPlayer.draft },
            ].map((item, i) => (
              <div key={i}>

                <div className="text-[17px] font-semibold text-white leading-none">
                  {item.value || "—"}
                </div>

                <div className="text-[10px] text-white/30 uppercase tracking-wide mt-1">
                  {item.label}
                </div>

              </div>
            ))}

          </div>
        </div>
      </div>

      {/* =====================
          SIGNAL INTELLIGENCE (UPGRADED)
      ===================== */}
      <div className="w-full mt-6">

        <div className="
          rounded-2xl
          border border-white/10
          bg-[linear-gradient(180deg,rgba(12,16,26,0.95),rgba(8,10,18,0.75))]
          backdrop-blur-xl
          p-5
          shadow-[0_0_50px_rgba(0,0,0,0.7)]
        ">

          <div className="flex items-center justify-between mb-4">

            <div className="text-[10px] tracking-[0.25em] text-white/30 uppercase">
              Signal Intelligence
            </div>

            <div className="text-[11px] text-[#dbf93a] px-2 py-1 rounded-md bg-[#dbf93a]/10 border border-[#dbf93a]/20">
              {player.reasons?.length || 0} ACTIVE
            </div>

          </div>

          <div className="space-y-2">

            {player.reasons?.length ? (
              player.reasons.map((r: string, i: number) => (
                <div
                  key={i}
                  className="
                    relative
                    px-3 py-2.5
                    rounded-lg
                    border border-white/10
                    bg-white/5
                    overflow-hidden
                    hover:bg-white/10
                    transition
                  "
                >
                  <div className="absolute left-0 top-0 h-full w-[3px] bg-[#dbf93a]" />

                  <div className="pl-2 text-[13px] text-white/85 tracking-wide">
                    {r.replaceAll("_", " ")}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-white/40">
                No signals detected
              </div>
            )}

          </div>
        </div>
      </div>

      {/* =====================
          LAST 5 (UPGRADED CARDS)
      ===================== */}
      <div className="w-full mt-6">

        <div className="
          rounded-2xl
          border border-white/10
          bg-[linear-gradient(180deg,rgba(12,16,26,0.95),rgba(8,10,18,0.75))]
          backdrop-blur-xl
          p-5
          shadow-[0_0_50px_rgba(0,0,0,0.7)]
        ">

          <div className="text-[10px] tracking-[0.25em] text-white/30 uppercase mb-4">
            Last 5 Performance
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">

            {[
              { label: "PTS", value: player.last5?.pts ?? "—" },
              { label: "AST", value: player.last5?.ast ?? "—" },
              { label: "REB", value: player.last5?.reb ?? "—" },
            ].map((stat, i) => (
              <div
                key={i}
                className="
                  rounded-xl
                  border border-white/10
                  bg-white/[0.04]
                  px-3 py-3
                  hover:bg-white/[0.08]
                  transition
                "
              >
                <div className="text-[22px] font-semibold text-white leading-none">
                  {stat.value}
                </div>

                <div className="mt-2 text-[10px] text-white/30 uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>

      {/* =====================
          ACTION BAR (ENHANCED)
      ===================== */}
      <div className="w-full mt-8 space-y-3">

        <button
          className="
            w-full
            py-3
            rounded-xl
            bg-[#dbf93a]
            text-black
            font-semibold
            shadow-[0_0_30px_rgba(219,249,58,0.25)]
            hover:scale-[1.01]
            active:scale-[0.98]
            transition
          "
        >
          ADD TO POOL
        </button>

        <div className="flex gap-3">

          <button
            className="
              flex-1
              py-3
              rounded-xl
              bg-white/5
              border border-white/10
              text-white
              hover:bg-white/10
              transition
            "
          >
            TRACK PLAYER
          </button>

          <button
            onClick={() => window.history.back()}
            className="
              flex-1
              py-3
              rounded-xl
              bg-white/5
              border border-white/10
              text-white
              hover:bg-white/10
              transition
            "
          >
            ← BACK
          </button>

        </div>

      </div>

    </div>
  </div>
);
}