export function Input({
  placeholder, type = "text", value, onChange, icon: Icon, className = "",
}: {
  placeholder?: string; type?: string; value?: string;
  onChange?: (v: string) => void; icon?: React.ElementType; className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      {Icon && <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />}
      <input
        type={type} placeholder={placeholder} value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full bg-[#111336] border border-white/[0.07] rounded-lg text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all ${Icon ? "pl-9 pr-3 py-2.5" : "px-3 py-2.5"}`}
      />
    </div>
  );
}
