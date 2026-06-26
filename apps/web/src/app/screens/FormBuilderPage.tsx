import { useState } from "react";
import { motion } from "motion/react";
import { Clipboard, Plus, Text, Mail, ListChecks, CheckSquare, Circle, Upload, FileText, Eye, BarChart3 } from "lucide-react";
import { PageHeader, Card, Btn, Badge, StatCard } from "../components/shared";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const fieldTypes = [
  { name: "Text", icon: Text }, { name: "Email", icon: Mail },
  { name: "Select", icon: ListChecks }, { name: "Checkbox", icon: CheckSquare },
  { name: "Radio", icon: Circle }, { name: "File Upload", icon: Upload },
];

export default function FormBuilderPage() {
  const [tab, setTab] = useState("all");
  const forms = [
    { name: "Brand Inquiry Form", fields: 8, responses: 234, status: "active" },
    { name: "Client Briefing", fields: 12, responses: 89, status: "active" },
    { name: "Feedback Survey", fields: 6, responses: 567, status: "active" },
    { name: "Job Application", fields: 15, responses: 45, status: "draft" },
    { name: "Event Registration", fields: 10, responses: 0, status: "draft" },
  ];
  const submissions = [
    { name: "Sarah Johnson", form: "Brand Inquiry", date: "2h ago" },
    { name: "Mike Chen", form: "Client Briefing", date: "4h ago" },
    { name: "Emily Davis", form: "Feedback Survey", date: "1d ago" },
    { name: "James Wilson", form: "Brand Inquiry", date: "1d ago" },
  ];
  return (
    <motion.div {...pageAnim}>
      <PageHeader title="Form Builder" subtitle="Create and manage forms for brand submissions"
        actions={<Btn variant="primary" icon={Plus}>New Form</Btn>}
      />
      <div className="grid grid-cols-4 gap-3 mb-6">
        <StatCard label="Active Forms" value="3" icon={Clipboard} color="violet" />
        <StatCard label="Total Responses" value="935" icon={BarChart3} color="blue" />
        <StatCard label="Completion Rate" value="84%" icon={CheckSquare} color="emerald" />
        <StatCard label="Field Types" value="6" icon={ListChecks} color="cyan" />
      </div>
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-sm">Your Forms</h3>
              <div className="flex gap-1 bg-[#111336] p-1 rounded-lg">
                {["all", "active", "draft"].map((t) => (
                  <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-all ${tab === t ? "bg-violet-600/30 text-violet-300" : "text-slate-500 hover:text-slate-300"}`}>{t}</button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              {forms.filter(f => tab === "all" || f.status === tab).map((f) => (
                <div key={f.name} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.03] transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center flex-shrink-0">
                    <Clipboard size={14} className="text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{f.name}</p>
                    <p className="text-xs text-slate-500">{f.fields} fields · {f.responses} responses</p>
                  </div>
                  <Badge color={f.status === "active" ? "green" : "gray"}>{f.status}</Badge>
                  <Btn variant="ghost" size="sm" icon={Eye} />
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-4">
            <h3 className="font-bold text-white text-sm mb-3">Recent Submissions</h3>
            <div className="space-y-2">
              {submissions.map((s) => (
                <div key={s.name + s.form} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/[0.02] transition-colors">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-[9px] font-bold text-white">
                    {s.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white">{s.name}</p>
                    <p className="text-xs text-slate-500">{s.form}</p>
                  </div>
                  <span className="text-xs text-slate-500">{s.date}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <Card className="p-4">
          <h3 className="font-bold text-white text-sm mb-4">Field Types</h3>
          <div className="space-y-2">
            {fieldTypes.map((ft) => {
              const Icon = ft.icon;
              return (
                <div key={ft.name} className="flex items-center gap-3 p-3 rounded-lg border border-white/[0.06] hover:border-violet-500/30 transition-colors cursor-pointer">
                  <div className="w-7 h-7 rounded-md bg-violet-500/15 flex items-center justify-center">
                    <Icon size={12} className="text-violet-400" />
                  </div>
                  <span className="text-sm text-slate-300">{ft.name}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-white/[0.06]">
            <Btn variant="primary" className="w-full justify-center" icon={Eye}>Preview Form</Btn>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
