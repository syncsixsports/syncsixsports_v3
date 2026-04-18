import clsx from "clsx";

type GlowTone = "cyan" | "purple" | "orange" | "green" | "yellow" | "red";

type GlowStatProps = {
  label: string;
  value: string | number;
  sublabel?: string;
  tone?: GlowTone;
  className?: string;
};

const toneClassMap: Record<GlowTone, string> = {
  cyan: "glow-cyan",
  purple: "glow-purple",
  orange: "glow-orange",
  green: "glow-green",
  yellow: "glow-yellow",
  red: "glow-red",
};

const toneTextMap: Record<GlowTone, string> = {
  cyan: "text-[var(--accent-cyan)]",
  purple: "text-[var(--accent-purple)]",
  orange: "text-[var(--accent-orange)]",
  green: "text-[var(--accent-green)]",
  yellow: "text-[var(--accent-yellow)]",
  red: "text-[var(--accent-red)]",
};

export default function GlowStat({
  label,
  value,
  sublabel,
  tone = "cyan",
  className,
}: GlowStatProps) {
  return (
    <div
      className={clsx(
        "surface-inner rounded-[20px] p-4",
        "flex flex-col justify-between",
        "transition-transform duration-200 hover:-translate-y-0.5",
        toneClassMap[tone],
        className
      )}
    >
      {/* Label */}
      <div className="text-label mb-2">
        {label}
      </div>

      {/* Value */}
      <div className={clsx("text-metric", toneTextMap[tone])}>
        {value}
      </div>

      {/* Sublabel */}
      {sublabel && (
        <div className="mt-2 text-sm text-[var(--text-secondary)]">
          {sublabel}
        </div>
      )}
    </div>
  );
}