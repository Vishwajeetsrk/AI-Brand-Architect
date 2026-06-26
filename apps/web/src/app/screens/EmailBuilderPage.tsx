"use client";
import { useState } from "react";
import { motion } from "motion/react";
import {
  Mail, Send, Users, TrendingUp, BarChart3, Eye, MousePointerClick,
  AlertTriangle, Plus, Search, Download, Save, Play, FileText, Image,
  Layout, Palette, Settings, ChevronRight, X, Clock,
} from "lucide-react";
import { Btn, Card, Badge, StatCard, PageHeader, Input, Toggle } from "../components/shared";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const templates = [
  { name: "Welcome Series", desc: "Onboard new subscribers", gradient: "from-violet-600 to-blue-600", opens: "45.2%", clicks: "12.8%" },
  { name: "Product Launch", desc: "Announce new products", gradient: "from-pink-600 to-rose-600", opens: "38.7%", clicks: "9.4%" },
  { name: "Newsletter", desc: "Regular updates & news", gradient: "from-cyan-600 to-blue-600", opens: "32.1%", clicks: "5.6%" },
  { name: "Abandoned Cart", desc: "Recover lost sales", gradient: "from-amber-600 to-orange-600", opens: "51.3%", clicks: "18.2%" },
  { name: "Re-engagement", desc: "Win back inactive users", gradient: "from-emerald-600 to-teal-600", opens: "28.9%", clicks: "7.1%" },
  { name: "Holiday Campaign", desc: "Seasonal promotions", gradient: "from-red-600 to-pink-600", opens: "41.5%", clicks: "11.3%" },
];

const performanceData = [
  { month: "Week 1", sent: 12000, opened: 4800, clicked: 1200, bounced: 240 },
  { month: "Week 2", sent: 18500, opened: 7200, clicked: 2100, bounced: 370 },
  { month: "Week 3", sent: 22400, opened: 9400, clicked: 2800, bounced: 450 },
  { month: "Week 4", sent: 31800, opened: 13800, clicked: 4200, bounced: 640 },
];

export default function EmailBuilderPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [testEmail, setTestEmail] = useState("");
  const [showTestModal, setShowTestModal] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [emailSubject, setEmailSubject] = useState("Your monthly design inspiration");
  const [preheader, setPreheader] = useState("View this email in your browser");

  return (
    <motion.div {...pageAnim}>
      <PageHeader
        title="Email Builder"
        subtitle="Design and send beautiful email campaigns"
        actions={<><Btn variant="secondary" size="sm" icon={Save}>Save Draft</Btn><Btn variant="primary" icon={Send} onClick={() => setShowTestModal(true)}>Send Test</Btn></>}
      />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Open Rate" value="42.3%" delta="+3.8% vs last month" icon={Eye} color="violet" />
        <StatCard label="Click Rate" value="12.7%" delta="+1.2% pts" icon={MousePointerClick} color="blue" />
        <StatCard label="Bounce Rate" value="2.1%" delta="-0.4% pts" icon={AlertTriangle} color="emerald" />
        <StatCard label="Active Lists" value="8" delta="+2 this month" icon={Users} color="cyan" />
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-5">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-sm">Campaign Editor</h3>
              <div className="flex items-center gap-2">
                <Btn variant={previewMode ? "primary" : "ghost"} size="sm" icon={Eye} onClick={() => setPreviewMode(!previewMode)}>
                  {previewMode ? "Edit" : "Preview"}
                </Btn>
              </div>
            </div>

            {!previewMode ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-500 mb-1.5 block">Subject Line</label>
                    <Input value={emailSubject} onChange={setEmailSubject} placeholder="Enter subject line..." />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1.5 block">Preheader Text</label>
                    <Input value={preheader} onChange={setPreheader} placeholder="Preheader text..." />
                  </div>
                </div>

                <div className="border border-white/[0.06] rounded-xl bg-[#111336] min-h-[280px] flex flex-col">
                  <div className="flex items-center gap-1 px-3 py-2 border-b border-white/[0.06] bg-[#0d0f2a] rounded-t-xl">
                    {[FileText, Image, Layout, Settings].map((Icon, i) => (
                      <button key={i} className="p-1.5 rounded-md hover:bg-white/[0.06] text-slate-500 hover:text-white transition-colors"><Icon size={13} /></button>
                    ))}
                    <div className="flex-1" />
                    <span className="text-[10px] text-slate-600">Drag blocks to build your email</span>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <Mail size={28} className="text-slate-600 mx-auto mb-2" />
                      <p className="text-sm text-slate-500">Start building your email campaign</p>
                      <p className="text-xs text-slate-600 mt-1">Add content blocks from the toolbar above</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Btn variant="secondary" size="sm" icon={Image}>Add Image</Btn>
                    <Btn variant="secondary" size="sm" icon={FileText}>Text Block</Btn>
                    <Btn variant="secondary" size="sm" icon={Layout}>Divider</Btn>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock size={12} /> Last saved 2m ago
                  </div>
                </div>
              </div>
            ) : (
              <div className="border border-white/[0.06] rounded-xl bg-white min-h-[280px] flex items-center justify-center">
                <div className="text-center p-8 max-w-md">
                  <div className="bg-violet-600 text-white text-sm font-bold px-6 py-3 rounded-t-lg">
                    {emailSubject || "Your monthly design inspiration"}
                  </div>
                  <div className="bg-gray-50 p-6 text-left text-gray-800 rounded-b-lg">
                    <p className="text-xs text-gray-500 mb-3">{preheader}</p>
                    <h2 className="text-lg font-bold mb-2">Hey there!</h2>
                    <p className="text-sm text-gray-600 mb-4">Here's your monthly roundup of design inspiration and tips to help you create amazing brand experiences.</p>
                    <div className="bg-violet-100 rounded-lg p-4 text-center mb-4">
                      <p className="text-sm font-semibold text-violet-800">Check out our latest templates →</p>
                    </div>
                    <p className="text-xs text-gray-400 mt-4">Sent by Nexora Design Studio</p>
                  </div>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-sm">Campaign Performance (Last 4 Weeks)</h3>
              <div className="flex gap-2">
                {["Sent", "Opened", "Clicked"].map((t) => (
                  <div key={t} className="flex items-center gap-1.5"><div className={`w-3 h-1 rounded ${t === "Sent" ? "bg-violet-500" : t === "Opened" ? "bg-blue-500" : "bg-cyan-500"}`} /><span className="text-xs text-slate-500">{t}</span></div>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {["Week", "Sent", "Opened", "Clicked", "Bounced", "Open Rate"].map((h) => (
                      <th key={h} className="text-left px-3 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {performanceData.map((w) => (
                    <tr key={w.month} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      <td className="px-3 py-3 text-sm font-semibold text-white">{w.month}</td>
                      <td className="px-3 py-3 text-xs text-slate-400">{w.sent.toLocaleString()}</td>
                      <td className="px-3 py-3 text-xs text-slate-400">{w.opened.toLocaleString()}</td>
                      <td className="px-3 py-3 text-xs text-slate-400">{w.clicked.toLocaleString()}</td>
                      <td className="px-3 py-3 text-xs text-slate-400">{w.bounced.toLocaleString()}</td>
                      <td className="px-3 py-3 text-xs text-emerald-400 font-semibold">{((w.opened / w.sent) * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-sm">Email Templates</h3>
              <Btn variant="ghost" size="sm" icon={Plus}>New</Btn>
            </div>
            <div className="space-y-2">
              {templates.map((t, i) => (
                <button
                  key={t.name}
                  onClick={() => setSelectedTemplate(i)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${selectedTemplate === i ? "border-violet-500/50 bg-violet-500/10" : "border-white/[0.06] hover:border-white/20"}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.gradient} flex items-center justify-center flex-shrink-0`}>
                      <Mail size={16} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white">{t.name}</p>
                      <p className="text-[10px] text-slate-500">{t.desc}</p>
                    </div>
                    <ChevronRight size={12} className="text-slate-600" />
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-bold text-white text-sm mb-4">Recipient List Stats</h3>
            <div className="space-y-3">
              {[
                { label: "Total Subscribers", value: "48,240", color: "violet" },
                { label: "Active Subscribers", value: "42,180", color: "emerald" },
                { label: "Unsubscribed", value: "1,240", color: "red" },
                { label: "Spam Complaints", value: "38", color: "yellow" },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between p-2.5 rounded-lg bg-[#111336] border border-white/[0.05]">
                  <span className="text-xs text-slate-400">{s.label}</span>
                  <span className={`text-xs font-semibold text-${s.color === "violet" ? "violet" : s.color === "emerald" ? "emerald" : s.color === "red" ? "red" : "amber"}-400`}>{s.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-white/[0.06]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Health Score</span>
                <span className="text-emerald-400 font-semibold">96%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full mt-1"><div className="h-1.5 bg-emerald-500 rounded-full w-[96%]" /></div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <Play size={16} className="text-violet-400" />
              <div className="flex-1">
                <p className="text-sm font-bold text-white">Ready to Launch?</p>
                <p className="text-xs text-slate-500">Send to 42,180 active subscribers</p>
              </div>
              <Btn variant="primary" size="sm" icon={Send}>Send Now</Btn>
            </div>
          </Card>
        </div>
      </div>

      {showTestModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowTestModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white text-lg">Send Test Email</h3>
                <button onClick={() => setShowTestModal(false)} className="text-slate-500 hover:text-white p-1"><X size={16} /></button>
              </div>
              <div className="mb-4">
                <label className="text-xs text-slate-500 mb-1.5 block">Recipient Email</label>
                <Input icon={Mail} placeholder="you@example.com" value={testEmail} onChange={setTestEmail} />
              </div>
              <div className="flex items-center gap-2 mb-4">
                {["alex@studio.com", "sarah@studio.com"].map((e) => (
                  <button key={e} onClick={() => setTestEmail(e)} className="px-2.5 py-1.5 rounded-lg bg-[#111336] border border-white/[0.06] text-xs text-slate-400 hover:text-white transition-colors">{e}</button>
                ))}
              </div>
              <Btn variant="primary" className="w-full justify-center" icon={Send} disabled={!testEmail.includes("@")}>
                Send Test
              </Btn>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
