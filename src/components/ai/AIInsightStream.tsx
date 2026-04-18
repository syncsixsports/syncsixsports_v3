type Insight = {
  text: string;
  type: string;
};

export default function AIInsightStream({ insights }: { insights: Insight[] }) {
  return (
    <div className="space-y-2">

      {insights.map((insight, i) => {
        const isPrimary = i === 0;

        return (
          <div
            key={i}
            className={`flex gap-2 ${isPrimary ? "text-white font-medium" : "text-white/60 text-sm"}`}
          >
            <span className="text-green-400 mt-[2px]">
              ●
            </span>

            <span>{insight.text}</span>
          </div>
        );
      })}

    </div>
  );
}