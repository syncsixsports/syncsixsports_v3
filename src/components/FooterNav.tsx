"use client";

import { usePathname, useRouter } from "next/navigation";

const tabs = [
  { id: "home", label: "Home", icon: "⌂", path: "/" },
  { id: "calc", label: "Calc", icon: "∑", path: "/calc" },
  { id: "build", label: "Build", icon: "+", path: "/build" },
  { id: "history", label: "History", icon: "⏱", path: "/history" },
  { id: "settings", label: "Settings", icon: "⚙", path: "/settings" },
];

export default function FooterNav({
  onBuildHold,
}: {
  onBuildHold?: (val: boolean) => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center">
      {/* CONTAINER */}
      <div className="w-full max-w-[420px] mx-auto px-2 pb-2">
        <div
          className="
            flex justify-between items-center
            rounded-2xl
            border border-white/10
            bg-gradient-to-b from-[#0b0b12] to-[#050507]
            backdrop-blur-md
            px-4 py-2
            shadow-[0_-5px_25px_rgba(0,0,0,0.6)]
          "
        >
          {tabs.map((tab) => {
            const isActive =
              tab.path === "/"
                ? pathname === "/"
                : pathname.startsWith(tab.path);

            const isBuild = tab.id === "build";

            return (
              <button
                key={tab.id}
                onClick={() => {
                  // NORMAL NAVIGATION
                  router.push(tab.path);
                }}

                // 🔥 HOLD HANDLERS (ONLY FOR BUILD)
                onMouseDown={() => {
                  if (isBuild && onBuildHold) onBuildHold(true);
                }}
                onMouseUp={() => {
                  if (isBuild && onBuildHold) onBuildHold(false);
                }}
                onMouseLeave={() => {
                  if (isBuild && onBuildHold) onBuildHold(false);
                }}
                onTouchStart={() => {
                  if (isBuild && onBuildHold) onBuildHold(true);
                }}
                onTouchEnd={() => {
                  if (isBuild && onBuildHold) onBuildHold(false);
                }}

                className="
                  flex flex-col items-center justify-center
                  flex-1
                  text-[10px]
                  tracking-wide
                  transition
                "
              >
                {/* ICON */}
                <div
                  className={`
                    text-lg transition
                    ${
                      isActive
                        ? "text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.6)]"
                        : "text-white/40"
                    }
                  `}
                >
                  {tab.icon}
                </div>

                {/* LABEL */}
                <div
                  className={`
                    mt-1
                    ${
                      isActive
                        ? "text-white"
                        : "text-white/40"
                    }
                  `}
                >
                  {tab.label}
                </div>

                {/* ACTIVE INDICATOR */}
                <div
                  className={`
                    mt-1 h-[2px] w-6 rounded-full transition
                    ${
                      isActive
                        ? "bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.6)]"
                        : "bg-transparent"
                    }
                  `}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}