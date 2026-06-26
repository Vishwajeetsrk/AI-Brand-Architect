import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import type { Screen } from "../types";

export function AppLayout({ children, current, navigate }: {
  children: React.ReactNode; current: Screen; navigate: (s: Screen) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar current={current} navigate={navigate} collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar navigate={navigate} collapsed={collapsed} setCollapsed={setCollapsed} current={current} />
        <main className="flex-1 overflow-y-auto p-5">
          {children}
        </main>
      </div>
    </div>
  );
}
