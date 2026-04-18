type Insight = {
  text: string;
  confidence: string;
};

export default function AIHeroInsight({ insight }: { insight: Insight }) {
  return (
    <div className="relative mb-4 p-4 rounded-xl border border-white/10 bg-gradient-to-r from-cyan-500/10 to-purple-500/10">

      {/* AI ACTIVE */}
      <div className="absolute top-3 right-4 flex items-center gap-1 text-[10px] text-green-400">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        AI ACTIVE
      </div>

      {/* LABEL */}
      <div className="text-[10px] text-white/40 mb-1 tracking-wide">
        PRIMARY SIGNAL IDENTIFIED
      </div>

      {/* MAIN */}
      <div className="text-lg font-semibold text-white leading-snug">
        {insight.text}
      </div>

      {/* MICRO DATA (ADD THIS NEXT FROM ENGINE LATER) */}
      <div className="text-xs text-white/50 mt-2">
        Alignment signal detected across key metrics
      </div>

      {/* CONFIDENCE */}
      <div className="text-[10px] text-white/40 mt-1">
        {insight.confidence.toUpperCase()} SIGNAL
      </div>

    </div>
  );
}