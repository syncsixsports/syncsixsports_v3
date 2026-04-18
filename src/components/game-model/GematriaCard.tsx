import Card from "../ui/Card";
import type { GematriaValue } from "./types";

type Props = {
  values: GematriaValue[];
};

export default function GematriaCard({ values }: Props) {
  return (
    <Card variant="strong" padding="md">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-h3">Gematria</h2>

        <span className="text-[10px] uppercase tracking-[0.18em] text-white/40">
          Pattern Layer
        </span>
      </div>

      {/* Rows */}
      <div className="space-y-2">
        {values.map((item) => {
          const isMatch = item.match;

          return (
            <div
              key={item.label}
              className={[
                "flex items-center justify-between rounded-[var(--radius-md)] px-3 py-2 border transition-all duration-200",
                isMatch
                  ? "border-cyan-300/25 bg-cyan-400/10"
                  : "border-white/10 bg-white/[0.06]",
              ].join(" ")}
            >
              <span
                className={[
                  "truncate text-sm",
                  isMatch ? "text-cyan-100" : "text-white/80",
                ].join(" ")}
              >
                {item.label}
              </span>

              <span
                className={[
                  "text-[18px] font-semibold",
                  isMatch ? "text-cyan-200" : "text-white",
                ].join(" ")}
              >
                {item.value}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}