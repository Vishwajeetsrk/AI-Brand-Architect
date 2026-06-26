export function EmptyPlaceholder({ icon: Icon, title, desc, action }: {
  icon: React.ElementType; title: string; desc: string; action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4">
        <Icon size={28} className="text-violet-400" />
      </div>
      <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-xs">{desc}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
