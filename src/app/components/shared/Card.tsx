export function Card({ children, className = "", onClick, glow }: {
  children: React.ReactNode; className?: string; onClick?: () => void; glow?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-card border border-white/[0.06] rounded-xl ${glow ? "shadow-lg shadow-violet-900/20" : ""} ${onClick ? "cursor-pointer hover:border-violet-500/30 transition-colors" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
