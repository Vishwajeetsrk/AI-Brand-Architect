"use client";

import { useState } from "react";
import { Sidebar } from "../../app/layout/Sidebar";
import { TopBar } from "../../app/layout/TopBar";
import { useNavigate, useCurrentScreen } from "../../lib/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const current = useCurrentScreen();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar current={current as any} navigate={navigate} collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar navigate={navigate} collapsed={collapsed} setCollapsed={setCollapsed} current={current as any} />
        <main className="flex-1 overflow-y-auto p-5">{children}</main>
      </div>
    </div>
  );
}
