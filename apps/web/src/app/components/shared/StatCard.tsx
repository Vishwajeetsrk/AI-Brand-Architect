import { ArrowUpRight } from "lucide-react";
import { Card } from "./Card";

export function StatCard({ label, value, delta, icon: Icon, color = "violet" }: {
  label: string; value: string; delta?: string; icon: React.ElementType; color?: string;
}) {
  const colors: Record<string, string> = {
    violet: "from-violet-600/20 to-violet-600/5 border-violet-500/20 text-violet-400",
    blue: "from-blue-600/20 to-blue-600/5 border-blue-500/20 text-blue-400",
    cyan: "from-cyan-600/20 to-cyan-600/5 border-cyan-500/20 text-cyan-400",
    emerald: "from-emerald-600/20 to-emerald-600/5 border-emerald-500/20 text-emerald-400",
  };
  return (
    <Card className={`p-5 bg-gradient-to-br ${colors[color]} border`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {delta && (
            <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <ArrowUpRight size={10} /> {delta}
            </p>
          )}
        </div>
        <div className={`p-2.5 rounded-lg bg-current/10`}>
          <Icon size={18} className="opacity-80" />
        </div>
      </div>
    </Card>
  );
}
