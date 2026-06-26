import { motion } from "motion/react";
import { GitBranch, Play, CheckCircle, Clock, Zap, Activity, Bot, GitMerge, Plug, Bell, Download, Webhook } from "lucide-react";
import { Btn, Card, Badge, StatCard, PageHeader } from "../components/shared";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const NODE_PALETTE = [
  { icon: Zap, label: "Trigger", color: "from-amber-600 to-orange-600" },
  { icon: Bot, label: "AI Action", color: "from-violet-600 to-blue-600" },
  { icon: GitMerge, label: "Logic", color: "from-cyan-600 to-blue-600" },
  { icon: Plug, label: "Integration", color: "from-emerald-600 to-teal-600" },
  { icon: Bell, label: "Notification", color: "from-pink-600 to-violet-600" },
  { icon: Download, label: "Output", color: "from-gray-600 to-slate-600" },
];

const CANVAS_NODES = [
  { label: "Trigger", desc: "New Brand Created", icon: Zap, color: "from-amber-600 to-orange-600", x: "10%", y: "40%" },
  { label: "AI Generate", desc: "Generate Brand Kit", icon: Bot, color: "from-violet-600 to-blue-600", x: "30%", y: "40%" },
  { label: "Review", desc: "Approval Required", icon: Activity, color: "from-cyan-600 to-blue-600", x: "55%", y: "40%" },
  { label: "Export", desc: "Export Assets", icon: Download, color: "from-emerald-600 to-teal-600", x: "75%", y: "30%" },
  { label: "Notify", desc: "Slack Notification", icon: Bell, color: "from-pink-600 to-violet-600", x: "75%", y: "55%" },
];

export default function WorkflowPage() {
  return (
    <motion.div {...pageAnim}>
      <PageHeader
        title="Workflow Builder"
        subtitle="Design automated workflows for your brand processes"
        actions={<Btn variant="primary" icon={Play}>Run Workflow</Btn>}
      />
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Active Workflows" value="12" icon={GitBranch} color="violet" />
        <StatCard label="Runs Today" value="847" delta="+23%" icon={Play} color="blue" />
        <StatCard label="Success Rate" value="98.7%" icon={CheckCircle} color="emerald" />
        <StatCard label="Time Saved" value="124h" icon={Clock} color="cyan" />
      </div>
      <div className="flex gap-5">
        <div className="space-y-2 w-36 flex-shrink-0">
          {NODE_PALETTE.map((node) => {
            const Icon = node.icon;
            return (
              <button key={node.label} className="flex items-center gap-2.5 w-full p-2.5 rounded-lg bg-[#111336] border border-white/10 hover:border-violet-500/40 transition-all text-left group">
                <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${node.color} flex items-center justify-center`}>
                  <Icon size={12} className="text-white" />
                </div>
                <span className="text-xs text-slate-400 group-hover:text-white transition-colors">{node.label}</span>
              </button>
            );
          })}
        </div>
        <Card className="flex-1 p-6 relative min-h-[400px] bg-gradient-to-br from-[#0a0b1e] to-[#111336]">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
          <div className="relative z-10 flex items-center justify-center h-full">
            {CANVAS_NODES.map((node, i) => {
              const Icon = node.icon;
              return (
                <div key={node.label} className="absolute" style={{ left: node.x, top: node.y }}>
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-card to-[#111336] border border-white/10 flex items-center justify-center shadow-lg shadow-violet-900/10 cursor-move hover:border-violet-500/50 transition-all group">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${node.color} flex items-center justify-center`}>
                        <Icon size={14} className="text-white" />
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-white mt-1.5">{node.label}</p>
                    <p className="text-[9px] text-slate-600">{node.desc}</p>
                    {i < CANVAS_NODES.length - 1 && (
                      <div className="w-px h-6 bg-gradient-to-b from-violet-500/40 to-transparent mt-1" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
