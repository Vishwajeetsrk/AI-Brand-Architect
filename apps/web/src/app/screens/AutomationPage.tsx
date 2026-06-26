import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  GitBranch, Play, CheckCircle, Clock, Zap, Activity, Bot,
  GitMerge, Plug, Bell, Download, Webhook, X, Plus, Settings,
  Trash2, List, Layout, Pause, PlayIcon, AlertCircle,
  Workflow, Split, Timer, FileOutput, GripVertical,
  ArrowRight, Search, Eye, EyeOff, Star
} from "lucide-react";
import { Btn, Card, Badge, StatCard, PageHeader } from "../components/shared";

type NodeType = "trigger" | "action" | "condition" | "delay" | "output";

interface NodeDef {
  type: NodeType;
  label: string;
  desc: string;
  icon: React.ElementType;
  color: string;
}

interface FlowNode {
  id: string;
  type: NodeType;
  label: string;
  desc: string;
  icon: React.ElementType;
  color: string;
  x: number;
  y: number;
  nextIds: string[];
}

interface Template {
  id: string;
  name: string;
  desc: string;
  category: string;
  duration: string;
  popularity: number;
  nodes: FlowNode[];
}

interface WorkflowItem {
  id: string;
  name: string;
  desc: string;
  status: "active" | "paused" | "draft";
  runCount: number;
  lastRun: string | null;
}

const NODE_PALETTE: NodeDef[] = [
  { type: "trigger", label: "Trigger", desc: "Starts the workflow", icon: Zap, color: "from-amber-600 to-orange-600" },
  { type: "action", label: "Action", desc: "AI / Integration task", icon: Bot, color: "from-violet-600 to-blue-600" },
  { type: "condition", label: "Condition", desc: "Branch logic", icon: Split, color: "from-cyan-600 to-blue-600" },
  { type: "delay", label: "Delay", desc: "Wait before next step", icon: Timer, color: "from-yellow-600 to-amber-600" },
  { type: "output", label: "Output", desc: "Final result", icon: FileOutput, color: "from-emerald-600 to-teal-600" },
];

const PAGE_ANIM = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const TEMPLATES: Template[] = [
  { id: "t1", name: "Brand Kit Generator", desc: "Generate a full brand kit when a new brand is created", category: "Branding", duration: "~3 min", popularity: 92, nodes: [] },
  { id: "t2", name: "Social Media Publisher", desc: "Create, review, and publish social content", category: "Marketing", duration: "~5 min", popularity: 88, nodes: [] },
  { id: "t3", name: "Content Approval Flow", desc: "Multi-stage approval with notifications", category: "Collaboration", duration: "~2 min", popularity: 85, nodes: [] },
  { id: "t4", name: "Asset Transformer", desc: "Auto-resize and convert uploaded assets", category: "Assets", duration: "~1 min", popularity: 79, nodes: [] },
  { id: "t5", name: "Email Campaign", desc: "Triggered email campaigns with delays", category: "Marketing", duration: "~4 min", popularity: 82, nodes: [] },
  { id: "t6", name: "Brand Health Audit", desc: "Weekly brand consistency check", category: "Branding", duration: "~6 min", popularity: 74, nodes: [] },
  { id: "t7", name: "Slack Command Bot", desc: "Handle /commands from Slack", category: "Integrations", duration: "~1 min", popularity: 71, nodes: [] },
  { id: "t8", name: "Multi-Channel Campaign", desc: "Coordinated launch across channels", category: "Marketing", duration: "~8 min", popularity: 77, nodes: [] },
];

const SAMPLE_WORKFLOWS: WorkflowItem[] = [
  { id: "w1", name: "Brand Kit Auto-Generator", desc: "Auto-generates brand kits from submissions", status: "active", runCount: 342, lastRun: "2 min ago" },
  { id: "w2", name: "Social Media Queue", desc: "Multi-platform approval pipeline", status: "active", runCount: 187, lastRun: "15 min ago" },
  { id: "w3", name: "Asset Optimization", desc: "Resize & convert uploaded assets", status: "active", runCount: 892, lastRun: "1 min ago" },
  { id: "w4", name: "Brand Health Report", desc: "Weekly consistency audit", status: "paused", runCount: 48, lastRun: "3 days ago" },
  { id: "w5", name: "Onboarding Sequence", desc: "New user email onboarding", status: "draft", runCount: 0, lastRun: null },
];

const CANVAS_NODES: FlowNode[] = [
  { id: "n1", type: "trigger", label: "Trigger", desc: "Brand Created", icon: Zap, color: "from-amber-600 to-orange-600", x: 8, y: 40, nextIds: ["n2"] },
  { id: "n2", type: "action", label: "AI Generate", desc: "Generate Brand Kit", icon: Bot, color: "from-violet-600 to-blue-600", x: 28, y: 40, nextIds: ["n3"] },
  { id: "n3", type: "condition", label: "Review", desc: "Approval Required", icon: Split, color: "from-cyan-600 to-blue-600", x: 48, y: 40, nextIds: ["n4", "n5"] },
  { id: "n4", type: "action", label: "Export", desc: "Export Assets", icon: FileOutput, color: "from-emerald-600 to-teal-600", x: 68, y: 28, nextIds: ["n6"] },
  { id: "n5", type: "action", label: "Notify", desc: "Slack Notification", icon: Bell, color: "from-pink-600 to-violet-600", x: 68, y: 55, nextIds: ["n6"] },
  { id: "n6", type: "output", label: "Complete", desc: "Save & Log", icon: CheckCircle, color: "from-emerald-600 to-teal-600", x: 88, y: 40, nextIds: [] },
];

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-500",
  paused: "bg-amber-500",
  draft: "bg-slate-600",
};

export default function AutomationPage() {
  const [view, setView] = useState<"list" | "builder">("list");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);

  return (
    <motion.div {...PAGE_ANIM}>
      <PageHeader
        title="Automation Platform"
        subtitle="Visual workflow builder & business process automation engine"
        actions={
          <div className="flex items-center gap-2">
            <Btn variant="ghost" size="sm" onClick={() => setView("list")}>
              <List size={14} /> List
            </Btn>
            <Btn variant="ghost" size="sm" onClick={() => setView("builder")}>
              <Layout size={14} /> Builder
            </Btn>
            <Btn variant="primary" icon={Plus}>New Workflow</Btn>
          </div>
        }
      />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Active Workflows" value="12" icon={GitBranch} color="violet" />
        <StatCard label="Runs Today" value="847" delta="+23%" icon={Play} color="blue" />
        <StatCard label="Success Rate" value="98.7%" icon={CheckCircle} color="emerald" />
        <StatCard label="Time Saved" value="124h" icon={Clock} color="cyan" />
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">Template Gallery</h3>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Search size={12} />
            <span>Browse templates</span>
          </div>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => setSelectedTemplate(tpl)}
              className="flex-shrink-0 w-52 p-3 rounded-xl bg-[#111336] border border-white/10 hover:border-violet-500/40 transition-all text-left group"
            >
              <div className="flex items-center justify-between mb-2">
                <Badge color="violet">{tpl.category}</Badge>
                <span className="text-[10px] text-slate-600">{tpl.duration}</span>
              </div>
              <h4 className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors">{tpl.name}</h4>
              <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{tpl.desc}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <Star size={10} className="text-amber-400 fill-amber-400" />
                <span className="text-[10px] text-slate-500">{tpl.popularity}%</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === "list" ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">My Workflows</h3>
              <div className="relative">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  placeholder="Search workflows..."
                  className="w-48 pl-8 pr-3 py-1.5 rounded-lg bg-[#111336] border border-white/10 text-xs text-white placeholder:text-slate-600 outline-none focus:border-violet-500/40"
                />
              </div>
            </div>
            <Card className="overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/[0.06] text-xs text-slate-600">
                    <th className="py-3 px-4 font-medium">Name</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium">Runs</th>
                    <th className="py-3 px-4 font-medium">Last Run</th>
                    <th className="py-3 px-4 font-medium w-24">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {SAMPLE_WORKFLOWS.map((w) => (
                    <tr key={w.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group">
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-medium text-white">{w.name}</p>
                          <p className="text-[10px] text-slate-500">{w.desc}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_COLORS[w.status]}`} />
                          <span className="text-xs text-slate-400 capitalize">{w.status}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-400">{w.runCount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-xs text-slate-500">{w.lastRun || "—"}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 rounded-lg hover:bg-white/10 text-slate-500 hover:text-white transition-all">
                            <PlayIcon size={12} />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-white/10 text-slate-500 hover:text-white transition-all">
                            {w.status === "active" ? <Pause size={12} /> : <PlayIcon size={12} />}
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-white/10 text-slate-500 hover:text-red-400 transition-all">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </motion.div>
        ) : (
          <motion.div key="builder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex gap-4">
              <div className="w-36 flex-shrink-0 space-y-1.5">
                <p className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold mb-2">Nodes</p>
                {NODE_PALETTE.map((node) => {
                  const Icon = node.icon;
                  return (
                    <button
                      key={node.type}
                      className="flex items-center gap-2 w-full p-2.5 rounded-lg bg-[#111336] border border-white/10 hover:border-violet-500/40 transition-all text-left group cursor-grab active:cursor-grabbing"
                    >
                      <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${node.color} flex items-center justify-center flex-shrink-0`}>
                        <Icon size={12} className="text-white" />
                      </div>
                      <div>
                        <span className="text-xs text-slate-300 group-hover:text-white transition-colors block leading-tight">{node.label}</span>
                        <span className="text-[9px] text-slate-600">{node.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <Card className="flex-1 p-6 relative min-h-[460px] bg-gradient-to-br from-[#0a0b1e] to-[#111336] overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
                <div className="relative z-10">
                  {CANVAS_NODES.map((node, i) => {
                    const Icon = node.icon;
                    return (
                      <div key={node.id}>
                        <div
                          className="absolute flex flex-col items-center cursor-pointer"
                          style={{ left: `${node.x}%`, top: `${node.y}%`, transform: "translate(-50%, -50%)" }}
                          onClick={() => setSelectedNode(node)}
                        >
                          <div className={`w-[52px] h-[52px] rounded-xl bg-gradient-to-br from-card to-[#111336] border border-white/10 flex items-center justify-center shadow-lg shadow-violet-900/10 hover:border-violet-500/50 transition-all group ${selectedNode?.id === node.id ? "ring-2 ring-violet-500/40 border-violet-500/60" : ""}`}>
                            <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${node.color} flex items-center justify-center`}>
                              <Icon size={13} className="text-white" />
                            </div>
                          </div>
                          <p className="text-[11px] font-semibold text-white mt-1.5">{node.label}</p>
                          <p className="text-[8px] text-slate-600">{node.desc}</p>
                          {node.type === "condition" && (
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[8px] text-emerald-500/70">✓ Yes</span>
                              <span className="text-[8px] text-rose-500/70">✗ No</span>
                            </div>
                          )}
                        </div>
                        {node.nextIds.map((nextId, ei) => {
                          const target = CANVAS_NODES.find((n) => n.id === nextId);
                          if (!target) return null;
                          return (
                            <svg key={`${node.id}-${ei}`} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                              <defs>
                                <marker id={`arrowhead-${node.id}-${ei}`} markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
                                  <polygon points="0 0, 6 2, 0 4" fill="rgba(139,92,246,0.4)" />
                                </marker>
                              </defs>
                              <line
                                x1={`${node.x + 5}%`}
                                y1={`${node.y + 2}%`}
                                x2={`${target.x - 2}%`}
                                y2={`${target.y}%`}
                                stroke="rgba(139,92,246,0.35)"
                                strokeWidth="1.5"
                                strokeDasharray={node.type === "condition" && target.y > node.y ? "4,3" : "none"}
                                markerEnd={`url(#arrowhead-${node.id}-${ei})`}
                              />
                            </svg>
                          );
                        })}
                      </div>
                    );
                  })}

                  {CANVAS_NODES.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-[400px] text-slate-600">
                      <Workflow size={32} className="mb-3 opacity-40" />
                      <p className="text-sm font-medium text-slate-500">Empty Canvas</p>
                      <p className="text-xs text-slate-600 mt-1">Drag nodes from the palette to start building</p>
                    </div>
                  )}
                </div>
              </Card>

              <div className="w-56 flex-shrink-0">
                <p className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold mb-2">Configuration</p>
                {selectedNode ? (
                  <Card className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${selectedNode.color} flex items-center justify-center`}>
                          <selectedNode.icon size={11} className="text-white" />
                        </div>
                        <span className="text-xs font-semibold text-white">{selectedNode.label}</span>
                      </div>
                      <button onClick={() => setSelectedNode(null)} className="text-slate-600 hover:text-white transition-colors">
                        <X size={12} />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-slate-600 uppercase tracking-wider">Label</label>
                      <input defaultValue={selectedNode.desc} className="w-full px-2 py-1.5 rounded-lg bg-[#0a0b1e] border border-white/10 text-xs text-white outline-none focus:border-violet-500/40" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-slate-600 uppercase tracking-wider">Config</label>
                      <textarea
                        defaultValue={JSON.stringify({ id: selectedNode.id, type: selectedNode.type }, null, 2)}
                        rows={4}
                        className="w-full px-2 py-1.5 rounded-lg bg-[#0a0b1e] border border-white/10 text-[10px] text-slate-400 font-mono outline-none focus:border-violet-500/40 resize-none"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
                      <Btn variant="ghost" size="sm" className="text-red-400 hover:text-red-300"><Trash2 size={11} /> Delete</Btn>
                      <Btn variant="primary" size="sm" className="ml-auto"><Settings size={11} /> Apply</Btn>
                    </div>
                  </Card>
                ) : (
                  <Card className="p-4">
                    <div className="flex flex-col items-center text-center py-4">
                      <EyeOff size={18} className="text-slate-600 mb-2" />
                      <p className="text-xs text-slate-500">Select a node to edit</p>
                      <p className="text-[10px] text-slate-600 mt-1">Click any node on the canvas</p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedTemplate(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg p-6 rounded-2xl bg-[#0d0f2a] border border-white/10 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Badge color="violet">{selectedTemplate.category}</Badge>
                  <h2 className="text-lg font-bold text-white mt-2">{selectedTemplate.name}</h2>
                </div>
                <button onClick={() => setSelectedTemplate(null)} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-500 hover:text-white transition-all">
                  <X size={16} />
                </button>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{selectedTemplate.desc}</p>
              <div className="flex items-center gap-4 mt-4 py-3 border-y border-white/[0.06]">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock size={12} />
                  {selectedTemplate.duration}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Star size={12} className="text-amber-400" />
                  {selectedTemplate.popularity}% popularity
                </div>
              </div>
              <div className="flex gap-2 mt-5">
                <Btn variant="ghost" className="flex-1" onClick={() => setSelectedTemplate(null)}>Cancel</Btn>
                <Btn variant="primary" className="flex-1" icon={Plus}>Use Template</Btn>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
