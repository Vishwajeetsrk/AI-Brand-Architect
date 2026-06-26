import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Settings } from "lucide-react";
import { Avatar } from "../components/shared";
import { NAV_SECTIONS, BOTTOM_NAV } from "./navConfig";
import type { Screen } from "../types";

export function Sidebar({ current, navigate, collapsed, setCollapsed }: {
  current: Screen; navigate: (s: Screen) => void;
  collapsed: boolean; setCollapsed: (v: boolean) => void;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    Overview: true, "AI Studio": true, Library: false, Workflow: false,
    CRM: false, Team: false, Insights: false, Security: false,
  });

  return (
    <aside
      className={`flex flex-col h-full bg-sidebar border-r border-white/[0.06] transition-all duration-300 ${collapsed ? "w-[58px]" : "w-[220px]"} flex-shrink-0`}
    >
      <div className={`flex items-center gap-2.5 px-4 py-4 border-b border-white/[0.06] ${collapsed ? "justify-center px-0" : ""}`}>
        <img src="/logo.svg" alt="NEXORA" className="w-10 h-10 flex-shrink-0" />
        {!collapsed && (
          <div>
            <p className="text-sm font-bold text-white leading-none">NEXORA</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="mb-1">
            {!collapsed && (
              <button
                onClick={() => setExpanded((p) => ({ ...p, [section.label]: !p[section.label] }))}
                className="flex items-center justify-between w-full px-2 py-1 mb-0.5"
              >
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{section.label}</span>
                <ChevronDown size={10} className={`text-slate-600 transition-transform ${expanded[section.label] ? "" : "-rotate-90"}`} />
              </button>
            )}
            <AnimatePresence initial={false}>
              {(collapsed || expanded[section.label]) && (
                <motion.div
                  initial={collapsed ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = current === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => navigate(item.id)}
                        title={collapsed ? item.label : undefined}
                        className={`flex items-center gap-2.5 w-full rounded-lg text-sm transition-all duration-150 mb-0.5 ${collapsed ? "justify-center p-2.5" : "px-3 py-2"} ${active ? "bg-violet-600/20 text-violet-300 font-semibold" : "text-slate-500 hover:text-slate-200 hover:bg-white/5"}`}
                      >
                        <Icon size={15} className="flex-shrink-0" />
                        {!collapsed && (
                          <>
                            <span className="flex-1 text-left truncate">{item.label}</span>
                            {item.badge && (
                              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${item.badge === "New" ? "bg-cyan-500/20 text-cyan-400" : "bg-white/10 text-slate-400"}`}>
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/[0.06] py-2 px-2 space-y-0.5">
        {BOTTOM_NAV.map((item) => {
          const Icon = item.icon;
          const active = current === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-2.5 w-full rounded-lg text-sm transition-all duration-150 relative ${collapsed ? "justify-center p-2.5" : "px-3 py-2"} ${active ? "bg-violet-600/20 text-violet-300 font-semibold" : "text-slate-500 hover:text-slate-200 hover:bg-white/5"}`}
            >
              <Icon size={15} />
              {!collapsed && <span className="flex-1 text-left truncate">{item.label}</span>}
              {item.badge && !collapsed && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-red-500 text-white font-bold">{item.badge}</span>
              )}
              {item.badge && collapsed && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[8px] flex items-center justify-center font-bold">{item.badge}</span>
              )}
            </button>
          );
        })}

        <div className={`pt-2 border-t border-white/[0.06] flex ${collapsed ? "justify-center" : "items-center gap-2 px-1"}`}>
          {!collapsed && (
            <>
              <Avatar name="Alex Johnson" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">Alex Johnson</p>
                <p className="text-[10px] text-slate-500 truncate">Pro Plan</p>
              </div>
              <button onClick={() => navigate("settings")} className="text-slate-600 hover:text-slate-400 transition-colors">
                <Settings size={13} />
              </button>
            </>
          )}
          {collapsed && <Avatar name="Alex Johnson" size="sm" />}
        </div>
      </div>
    </aside>
  );
}
