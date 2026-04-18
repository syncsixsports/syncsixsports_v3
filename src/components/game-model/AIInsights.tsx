import Card from "../ui/Card";

type Insight = {
  type: "top" | "value" | "hidden";
  player: string;
  detail: string;
};

type Props = {
  insights: Insight[];
};

export default function AIInsights({ insights }: Props) {
  const labelMap = {
    top: "Top Play",
    value: "Best Value",
    hidden: "Hidden Gem",
  };

  const accentMap = {
    top: "text-cyan-300",
    value: "text-emerald-300",
    hidden: "text-violet-300",
  };

  return (
    <Card variant="strong" padding="md">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-h3">Insights</h2>

        <span className="text-[10px] uppercase tracking-[0.18em] text-white/40">
          Live Engine
        </span>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {insights.map((item, i) => (
          <div
            key={i}
            className="rounded-[var(--radius-lg)] border border-white/10 bg-white/[0.06] px-4 py-4 transition-all"
          >
            {/* Type */}
            <div className="text-[10px] uppercase tracking-[0.22em] text-white/40">
              {labelMap[item.type]}
            </div>

            {/* Player */}
            <div className="mt-1 text-xl font-semibold text-white">
              {item.player}
            </div>

            {/* Detail */}
            <div
              className={`mt-2 text-sm ${accentMap[item.type]} leading-relaxed`}
            >
              {item.detail}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}