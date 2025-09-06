"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./sidebar";
import Header from "./header";

const Structure = ({ children }: { children: React.ReactNode }) => {
  const [expanded, setExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show sidebar and header for all pages except landing page
  const showLayout = pathname !== "/";

  if (!showLayout) {
    return <div className="min-h-screen">{children}</div>;
  }

  // Don't render layout components until mounted to avoid SSR issues
  if (!mounted) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar expanded={expanded} setExpanded={setExpanded} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setExpanded={setExpanded} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default Structure;
