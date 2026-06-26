export function Badge({ children, color = "violet", className = "" }: { children: React.ReactNode; color?: string; className?: string }) {
  const colors: Record<string, string> = {
    violet: "bg-violet-500/15 text-violet-300 border-violet-500/20",
    blue: "bg-blue-500/15 text-blue-300 border-blue-500/20",
    green: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
    red: "bg-red-500/15 text-red-300 border-red-500/20",
    yellow: "bg-amber-500/15 text-amber-300 border-amber-500/20",
    cyan: "bg-cyan-500/15 text-cyan-300 border-cyan-500/20",
    gray: "bg-white/5 text-slate-400 border-white/10",
    pink: "bg-pink-500/15 text-pink-300 border-pink-500/20",
    orange: "bg-orange-500/15 text-orange-300 border-orange-500/20",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${colors[color] ?? colors.gray} ${className}`}>
      {children}
    </span>
  );
}
