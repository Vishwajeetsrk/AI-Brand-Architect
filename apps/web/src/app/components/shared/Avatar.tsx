export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const colors = ["from-violet-500 to-blue-500", "from-cyan-500 to-blue-500", "from-pink-500 to-violet-500", "from-emerald-500 to-cyan-500"];
  const c = colors[name.charCodeAt(0) % colors.length];
  const sizes = { sm: "w-6 h-6 text-[9px]", md: "w-8 h-8 text-xs", lg: "w-10 h-10 text-sm" };
  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br ${c} flex items-center justify-center font-bold text-white flex-shrink-0`}>
      {initials}
    </div>
  );
}
