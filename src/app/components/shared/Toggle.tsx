export function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`w-10 h-5.5 rounded-full transition-all duration-200 relative ${checked ? "bg-violet-600" : "bg-white/10"}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-transform duration-200 ${checked ? "translate-x-4.5" : "translate-x-0"}`} />
    </button>
  );
}
