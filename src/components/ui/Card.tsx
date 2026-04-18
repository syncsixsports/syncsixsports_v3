"use client";

import { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import clsx from "clsx";

type CardPadding = "sm" | "md" | "lg";
type CardVariant = "default" | "strong";

type CardProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children: ReactNode;
  className?: string;
  padding?: CardPadding;
  hover?: boolean;
  variant?: CardVariant;
};

const paddingMap: Record<CardPadding, string> = {
  sm: "p-3",
  md: "p-4",
  lg: "p-5",
};

export default function Card({
  children,
  className,
  padding = "md",
  hover = true,
  variant = "default",
  ...props
}: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -2 } : undefined}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={clsx(
        "relative w-full overflow-hidden rounded-[var(--radius-lg)]",
        
        // ✅ USE GLOBAL SYSTEM
        variant === "default" && "surface-glass",
        variant === "strong" && "surface-glass-strong",

        paddingMap[padding],

        // subtle hover polish
        hover && "transition-all duration-200",

        className
      )}
      {...props}
    >
      {/* top hairline */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-white/10" />

      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}