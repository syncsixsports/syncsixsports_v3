"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import clsx from "clsx";
import { ReactNode } from "react";

type ButtonTone = "cyan" | "purple" | "orange" | "green" | "neutral";

type ButtonPrimaryProps = Omit<HTMLMotionProps<"button">, "children"> & {
  children: ReactNode; // 🔒 lock to valid React content only
  active?: boolean;
  tone?: ButtonTone;
};

const toneMap: Record<
  Exclude<ButtonTone, "neutral">,
  {
    text: string;
    border: string;
    bg: string;
    glow: string;
    soft: string;
  }
> = {
  cyan: {
    text: "text-[var(--accent-cyan)]",
    border: "border-[rgba(88,225,255,0.34)]",
    bg: "bg-[rgba(88,225,255,0.14)]",
    glow: "shadow-[0_0_24px_rgba(88,225,255,0.22)]",
    soft: "hover:bg-[rgba(88,225,255,0.08)]",
  },
  purple: {
    text: "text-[var(--accent-purple)]",
    border: "border-[rgba(155,124,255,0.34)]",
    bg: "bg-[rgba(155,124,255,0.14)]",
    glow: "shadow-[0_0_24px_rgba(155,124,255,0.18)]",
    soft: "hover:bg-[rgba(155,124,255,0.08)]",
  },
  orange: {
    text: "text-[var(--accent-orange)]",
    border: "border-[rgba(255,155,94,0.34)]",
    bg: "bg-[rgba(255,155,94,0.14)]",
    glow: "shadow-[0_0_24px_rgba(255,155,94,0.18)]",
    soft: "hover:bg-[rgba(255,155,94,0.08)]",
  },
  green: {
    text: "text-[var(--accent-green)]",
    border: "border-[rgba(97,242,165,0.34)]",
    bg: "bg-[rgba(97,242,165,0.14)]",
    glow: "shadow-[0_0_24px_rgba(97,242,165,0.18)]",
    soft: "hover:bg-[rgba(97,242,165,0.08)]",
  },
};

export default function ButtonPrimary({
  children,
  className,
  active = false,
  tone = "cyan",
  ...props
}: ButtonPrimaryProps) {
  const palette =
    tone === "neutral"
      ? {
          text: "text-white",
          border: "border-white/15",
          bg: "bg-white/10",
          glow: "shadow-[0_0_18px_rgba(255,255,255,0.08)]",
          soft: "hover:bg-white/5",
        }
      : toneMap[tone];

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.14, ease: "easeOut" }}
     className={clsx(
  "w-full",
  "flex items-center justify-center",
  "rounded-md",                      // ← key change
  "border border-white/10",
  "py-2",                            // ← thinner
  "text-sm font-medium tracking-wide",
  "transition-all duration-200",
  "focus:outline-none",
  "disabled:opacity-50",

  active
    ? [
        "bg-[rgba(88,225,255,0.12)]",
        "border-[rgba(88,225,255,0.35)]",
        "text-[var(--accent-cyan)]",
        "shadow-[0_0_18px_rgba(88,225,255,0.15)]",
      ]
    : [
        "bg-transparent",
        "text-[var(--text-secondary)]",
        "hover:bg-white/5",
        "hover:text-white",
      ],

  className
)}
      {...props}
    >
      {/* Fill layer */}
      <span
        className={clsx(
          "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200",
          "bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.02))]",
          active && "opacity-100"
        )}
      />

      {/* Content */}
      <span className="relative z-10">
        {children}
      </span>
    </motion.button>
  );
}