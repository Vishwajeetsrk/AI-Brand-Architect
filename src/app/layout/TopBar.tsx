import { useState } from "react";
import { Home, ChevronRight, Menu, Search, Bell, CreditCard } from "lucide-react";
import { Input, Avatar } from "../components/shared";
import { LABEL_MAP } from "./navConfig";
import type { Screen } from "../types";

export function TopBar({ navigate, collapsed, setCollapsed, current }: {
  navigate: (s: Screen) => void; collapsed: boolean; setCollapsed: (v: boolean) => void; current: Screen;
}) {
  const [search, setSearch] = useState("");
  const currentLabel = LABEL_MAP[current] ?? "Dashboard";
  return (
    <header className="h-14 bg-[#07081a]/80 backdrop-blur border-b border-white/[0.06] flex items-center gap-3 px-4 flex-shrink-0">
      <button onClick={() => setCollapsed(!collapsed)} className="text-slate-500 hover:text-white transition-colors">
        <Menu size={18} />
      </button>
      <div className="flex items-center gap-1.5 text-sm text-slate-500">
        <Home size={13} />
        <ChevronRight size={12} />
        <span className="text-white font-medium">{currentLabel}</span>
      </div>
      <div className="flex-1" />
      <Input icon={Search} placeholder="Search anything…" value={search} onChange={setSearch} className="w-56" />
      <button onClick={() => navigate("notifications")} className="relative text-slate-500 hover:text-white transition-colors p-1.5">
        <Bell size={17} />
        <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-red-500" />
      </button>
      <button onClick={() => navigate("billing")} className="text-slate-500 hover:text-white transition-colors p-1.5">
        <CreditCard size={17} />
      </button>
      <button onClick={() => navigate("profile")} className="transition-transform hover:scale-105">
        <Avatar name="Alex Johnson" />
      </button>
    </header>
  );
}
