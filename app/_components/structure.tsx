"use client";
import React from "react";
import Header from "./header";
import Sidebar from "./sidebar";


const Structure = ({ children }: { children: React.ReactNode }) => {
    const [expanded, setExpanded] = React.useState(true);

  return (
    <div className="flex min-h-screen">
      <Sidebar expanded={expanded} setExpanded={setExpanded} />
      <div className="w-full overflow-hidden">
        <Header setExpanded={setExpanded} />
        {children}
      </div>
    </div>
  );
};

export default Structure;
