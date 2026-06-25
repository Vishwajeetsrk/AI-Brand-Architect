export function Btn({
  children, variant = "primary", size = "md", onClick, className = "", icon: Icon, disabled,
}: {
  children?: React.ReactNode; variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg"; onClick?: () => void; className?: string;
  icon?: React.ElementType; disabled?: boolean;
}) {
  const base = "inline-flex items-center gap-2 rounded-lg font-semibold transition-all duration-150 cursor-pointer select-none";
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm", lg: "px-6 py-3 text-base" };
  const variants = {
    primary: "bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white shadow-lg shadow-violet-900/30",
    secondary: "bg-[#111336] hover:bg-[#1a1d4a] text-slate-200 border border-white/10",
    ghost: "hover:bg-white/5 text-slate-400 hover:text-white",
    danger: "bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/20",
    outline: "border border-violet-500/40 text-violet-300 hover:bg-violet-500/10",
  };
  return (
    <button
      onClick={onClick} disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {Icon && <Icon size={size === "sm" ? 12 : size === "lg" ? 18 : 14} />}
      {children}
    </button>
  );
}
