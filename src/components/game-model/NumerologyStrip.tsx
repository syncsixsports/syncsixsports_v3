import type { NumerologyItem } from "./types";

type Props = {
  items: NumerologyItem[];
};

export default function NumerologyStrip({ items }: Props) {
  return (
    <div className="no-scrollbar -mx-1 overflow-x-auto px-1">
      <div className="flex gap-3">
        {items.map((item) => (
          <div
            key={item.key}
            className="shrink-0 rounded-full border border-white/10 bg-black/30 px-4 py-2 backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.18em] text-white/50">
                {item.key}
              </span>

              <span className="text-[18px] font-semibold text-white">
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}