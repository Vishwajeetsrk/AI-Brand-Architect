"use client";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { RefreshCw, CheckCircle, Clock } from "lucide-react";
import { Btn, Badge } from "../components/shared";
import type { Screen } from "../types";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

export default function MaintenancePage({ navigate }: { navigate: (s: Screen) => void }) {
  const [eta, setEta] = useState("~2 hours");
  const [statuses] = useState([
    { label: "Database optimization", done: true },
    { label: "Cache layer refresh", done: true },
    { label: "Feature deployment pipeline", done: true },
    { label: "Load balancer reconfiguration", done: false },
    { label: "CDN propagation", done: false },
  ]);

  useEffect(() => {
    const t = setInterval(() => {
      setEta((p) => {
        const match = p.match(/(\d+)/);
        if (!match) return p;
        const h = parseInt(match[1]);
        if (h <= 0) return "~15 minutes";
        return `~${h - 1} hours`;
      });
    }, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#07081a] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-radial from-cyan-900/20 via-transparent to-transparent"
        />
      </div>
      <motion.div {...pageAnim} className="w-full max-w-md text-center relative z-10">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 mx-auto mb-6"
        >
          <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border-2 border-cyan-500/30 flex items-center justify-center">
            <Clock size={40} className="text-cyan-400" />
          </div>
        </motion.div>
        <Badge color="cyan">Scheduled Maintenance</Badge>
        <h1 className="text-3xl font-extrabold text-white mt-4 mb-3">We&apos;ll Be Right Back</h1>
        <p className="text-slate-500 text-sm mb-8">
          We&apos;re performing some upgrades to make NEXORA even better. Your data is safe and nothing is lost.
        </p>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 mb-6 text-left">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</span>
            <span className="text-xs text-cyan-400 font-mono">{eta} remaining</span>
          </div>
          <div className="space-y-2.5">
            {statuses.map((s) => (
              <div key={s.label} className="flex items-center gap-2.5">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${s.done ? "bg-emerald-500/20" : "bg-white/5"}`}>
                  {s.done ? (
                    <CheckCircle size={12} className="text-emerald-400" />
                  ) : (
                    <motion.div
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-2 h-2 rounded-full bg-cyan-400"
                    />
                  )}
                </div>
                <span className={`text-xs ${s.done ? "text-slate-500 line-through" : "text-slate-300"}`}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <Btn variant="secondary" icon={RefreshCw} onClick={() => window.location.reload()} className="w-full justify-center">
          Try Again
        </Btn>
        <p className="text-xs text-slate-600 mt-4">
          Need help? <button onClick={() => navigate("help")} className="text-violet-400 hover:underline">Contact Support</button>
        </p>
      </motion.div>
    </div>
  );
}
