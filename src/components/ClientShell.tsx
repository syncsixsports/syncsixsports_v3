"use client";

import { useState } from "react";
import QuickBuildPanel from "./QuickBuildPanel";
import FooterNav from "./FooterNav";

export default function ClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showBuild, setShowBuild] = useState(false);

  return (
    <div className="relative">
      {/* PAGE CONTENT */}
      {children}

      {/* GLOBAL BUILD PANEL */}
      <QuickBuildPanel open={showBuild} />

      {/* GLOBAL FOOTER (CONTROLLED HERE) */}
      <FooterNav onBuildHold={setShowBuild} />
    </div>
  );
}