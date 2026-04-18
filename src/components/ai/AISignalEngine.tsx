import AIHeroInsight from "./AIHeroInsight";
import AIInsightStream from "./AIInsightStream";
import AISystemBar from "./AISystemBar";

type Insight = {
  text: string;
  type: "player" | "game" | "trend";
  priority: number;
  confidence: string;
};

export default function AISignalEngine({
  insights,
  games,
}: {
  insights: Insight[];
  games: any[];
}) {
  if (!insights?.length) return null;

  const hero = insights[0];
  const rest = insights.slice(1);

  return (
    <div className="mt-6">

      <div className="text-xs text-white/40 mb-2 px-1 tracking-wide">
        AI SIGNAL ENGINE
      </div>

      <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#0c0c14] to-[#050507] p-4 shadow-[0_0_30px_rgba(0,255,150,0.08)]">

        <AIHeroInsight insight={hero} />

        <AIInsightStream insights={rest} />

        <AISystemBar games={games} insights={insights} />

      </div>
    </div>
  );
}