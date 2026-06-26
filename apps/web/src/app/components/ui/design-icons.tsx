const ICON_NAMES = [
  "Activity", "AlertCircle", "AlertTriangle", "AlignLeft", "Archive",
  "ArrowDownRight", "ArrowRight", "ArrowUpRight", "AtSign", "Award",
  "BarChart2", "BarChart3", "Bell", "Bookmark", "BookOpen", "Bot",
  "BrainCircuit", "Calendar", "Check", "CheckCircle", "CheckSquare",
  "ChevronDown", "ChevronLeft", "ChevronRight", "ChevronUp", "Circle",
  "ClipboardList", "Code2", "Command", "Construction", "Copy", "Cpu",
  "CreditCard", "Crown", "Database", "DollarSign", "Download", "Edit2",
  "ExternalLink", "Eye", "EyeOff", "FileCode", "FileImage", "FileText",
  "Filter", "Folder", "FolderOpen", "Gauge", "GitBranch", "Globe", "Grid",
  "Hash", "Heart", "Hexagon", "Home", "ImagePlus", "Info", "Key", "Laptop",
  "Layers", "Layers2", "Layout", "LayoutDashboard", "Lightbulb", "Link",
  "List", "ListChecks", "Lock", "LogOut", "Map", "Megaphone", "Menu",
  "MessageCircle", "MessageSquare", "Mic", "Minus", "MonitorPlay", "Moon",
  "MoreHorizontal", "Network", "Package", "Paintbrush", "Pause", "Play",
  "PlayCircle", "Plug", "Plus", "Podcast", "Radio", "Receipt", "RefreshCw",
  "Rocket", "RotateCw", "Save", "Search", "Send", "Server", "Settings",
  "Share2", "Shield", "SkipForward", "SlidersHorizontal", "Sparkles",
  "Square", "Star", "Target", "Terminal", "Timer", "Trash2", "TrendingUp",
  "Triangle", "Upload", "User", "UserPlus", "Users", "Video", "Volume2",
  "Wand2", "Wifi", "Wrench", "X", "Zap",
] as const;

export type IconName = typeof ICON_NAMES[number];

export const ICON_CATALOG = ICON_NAMES;

export function DesignIcon({ name, size = 16, className = "" }: { name: IconName; size?: number; className?: string }) {
  return (
    <img
      src={`/icons/${name.toLowerCase().replace(/([a-z0-9])([A-Z])/g, "$1-$2")}.svg`}
      alt={name}
      width={size}
      height={size}
      className={`inline-block flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

export function DesignIconCatalog() {
  return (
    <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-3 p-4">
      {ICON_CATALOG.map((name) => (
        <div key={name} className="flex flex-col items-center gap-1.5 p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:border-violet-500/30 transition-all">
          <DesignIcon name={name} size={20} className="text-violet-300" />
          <span className="text-[10px] text-slate-500 text-center leading-tight">{name}</span>
        </div>
      ))}
    </div>
  );
}
