import { useState, useEffect } from "react";
import { Home, ChevronRight, Menu, Search, Bell, CreditCard, Command } from "lucide-react";
import { Avatar } from "../components/shared";
import { CommandPalette } from "../components/ui/command-palette";
import { LABEL_MAP } from "./navConfig";
import type { Screen } from "../types";

export function TopBar({ navigate, collapsed, setCollapsed, current }: {
  navigate: (s: Screen) => void; collapsed: boolean; setCollapsed: (v: boolean) => void; current: Screen;
}) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const currentLabel = LABEL_MAP[current] ?? "Dashboard";

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setPaletteOpen(true); }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  return (
    <header className="h-14 bg-[#07081a]/80 backdrop-blur border-b border-white/[0.06] flex items-center gap-3 px-4 flex-shrink-0">
      <button onClick={() => setCollapsed(!collapsed)} className="text-slate-500 hover:text-white transition-colors">
        <Menu size={18} />
      </button>
      <div className="flex items-center gap-1.5 text-sm text-slate-500">
        <button onClick={() => navigate("dashboard")} className="hover:text-white transition-colors"><Home size={13} /></button>
        <ChevronRight size={12} />
        <span className="text-white font-medium">{currentLabel}</span>
      </div>
      <div className="flex-1" />
      <button onClick={() => setPaletteOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-slate-500 hover:text-slate-300 hover:border-white/[0.12] transition-all text-xs w-56"
      >
        <Search size={14} />
        <span>Search anything...</span>
        <span className="ml-auto flex items-center gap-0.5 text-[10px] text-slate-600 bg-white/[0.06] px-1.5 py-0.5 rounded">
          <Command size={10} />K
        </span>
      </button>
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} navigate={navigate} />
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
