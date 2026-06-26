import { useState } from "react";
import { motion } from "motion/react";
import {
  Users, Briefcase, Target, Ticket, TrendingUp, DollarSign, Percent,
  MessageSquare, Phone, Mail, Plus, Search, Filter, ChevronRight,
  BarChart3, PieChart, Activity,
} from "lucide-react";
import { Btn, Card, StatCard, PageHeader, Badge } from "../components/shared";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

type Tab = "contacts" | "deals" | "campaigns" | "tickets" | "pipelines";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "contacts", label: "Contacts", icon: Users },
  { id: "deals", label: "Deals", icon: Briefcase },
  { id: "campaigns", label: "Campaigns", icon: Target },
  { id: "tickets", label: "Tickets", icon: Ticket },
  { id: "pipelines", label: "Pipelines", icon: BarChart3 },
];

const contacts = [
  { id: "c1", name: "Sarah Chen", email: "sarah@acme.com", company: "Acme Corp", status: "active", score: 95, tags: ["vip", "tech"], phone: "+1-555-0101", source: "referral" },
  { id: "c2", name: "Marcus Johnson", email: "marcus@globex.io", company: "Globex Inc", status: "active", score: 88, tags: ["tech", "enterprise"], phone: "+1-555-0102", source: "website" },
  { id: "c3", name: "Emily Rodriguez", email: "emily@novateck.com", company: "NovaTeck", status: "lead", score: 62, tags: ["marketing"], phone: "+1-555-0103", source: "linkedin" },
  { id: "c4", name: "James Kim", email: "james@quantum.dev", company: "Quantum Dev", status: "active", score: 91, tags: ["startup", "tech"], phone: "+1-555-0104", source: "referral" },
  { id: "c5", name: "Priya Patel", email: "priya@stellar.ai", company: "Stellar AI", status: "active", score: 85, tags: ["ai", "enterprise"], phone: "+1-555-0105", source: "event" },
  { id: "c6", name: "Tom Williams", email: "tom@dataforge.com", company: "DataForge", status: "lead", score: 45, tags: ["data"], phone: "+1-555-0106", source: "website" },
  { id: "c7", name: "Lisa Thompson", email: "lisa@bluemoon.co", company: "BlueMoon Co", status: "churned", score: 30, tags: ["brand", "design"], phone: "+1-555-0107", source: "ads" },
  { id: "c8", name: "David Garcia", email: "david@cyberdyne.systems", company: "Cyberdyne Systems", status: "active", score: 78, tags: ["product", "enterprise"], phone: "+1-555-0108", source: "referral" },
  { id: "c9", name: "Aisha Mohammed", email: "aisha@greentech.eco", company: "GreenTech Eco", status: "lead", score: 55, tags: ["eco", "startup"], phone: "+1-555-0109", source: "linkedin" },
  { id: "c10", name: "Ryan O'Brien", email: "ryan@omega.dev", company: "Omega Dev", status: "active", score: 93, tags: ["vip", "startup"], phone: "+1-555-0110", source: "event" },
  { id: "c11", name: "Nina Kowalski", email: "nina@polymath.io", company: "Polymath Inc", status: "lead", score: 58, tags: ["design", "creative"], phone: "+1-555-0111", source: "ads" },
  { id: "c12", name: "Carlos Mendez", email: "carlos@nexus.ventures", company: "Nexus Ventures", status: "active", score: 97, tags: ["investor", "vip"], phone: "+1-555-0112", source: "referral" },
];

const deals = [
  { id: "d1", name: "Acme Corp Enterprise Suite", contact: "Sarah Chen", value: 120000, stage: "negotiation", prob: 75, closeDate: "2026-07-15" },
  { id: "d2", name: "Globex AI Integration", contact: "Marcus Johnson", value: 85000, stage: "proposal", prob: 55, closeDate: "2026-08-01" },
  { id: "d3", name: "Quantum Dev Startup Pack", contact: "James Kim", value: 35000, stage: "negotiation", prob: 85, closeDate: "2026-07-01" },
  { id: "d4", name: "Stellar AI Partnership", contact: "Priya Patel", value: 200000, stage: "discovery", prob: 30, closeDate: "2026-09-15" },
  { id: "d5", name: "Cyberdyne Brand Refresh", contact: "David Garcia", value: 65000, stage: "proposal", prob: 60, closeDate: "2026-08-15" },
  { id: "d6", name: "Omega Dev Growth Package", contact: "Ryan O'Brien", value: 95000, stage: "closed_won", prob: 100, closeDate: "2026-06-28" },
  { id: "d7", name: "NovaTeck Marketing Stack", contact: "Emily Rodriguez", value: 45000, stage: "discovery", prob: 25, closeDate: "2026-10-01" },
  { id: "d8", name: "Nexus Ventures Strategic", contact: "Carlos Mendez", value: 300000, stage: "closed_won", prob: 100, closeDate: "2026-06-01" },
];

const campaigns = [
  { id: "cp1", name: "Q2 Enterprise Outreach", type: "email", status: "completed", budget: 25000, spent: 22300, reach: 45000, conv: 1200, roi: 320 },
  { id: "cp2", name: "Summer Brand Awareness", type: "social", status: "running", budget: 15000, spent: 7200, reach: 82000, conv: 3400, roi: 180 },
  { id: "cp3", name: "Product Hunt Launch", type: "ads", status: "draft", budget: 8000, spent: 0, reach: 0, conv: 0, roi: 0 },
  { id: "cp4", name: "AI Summit 2026", type: "events", status: "paused", budget: 35000, spent: 18500, reach: 15000, conv: 450, roi: 95 },
];

const tickets = [
  { id: "t1", subject: "API rate limiting issue", priority: "high", status: "in_progress", assignee: "Engineering", category: "api", created: "2026-06-22" },
  { id: "t2", subject: "Billing discrepancy", priority: "urgent", status: "open", assignee: "Billing", category: "billing", created: "2026-06-24" },
  { id: "t3", subject: "Feature request: Dark mode", priority: "low", status: "resolved", assignee: "Product", category: "feature", created: "2026-06-10" },
  { id: "t4", subject: "Integration with Slack failing", priority: "high", status: "open", assignee: "Engineering", category: "integration", created: "2026-06-23" },
  { id: "t5", subject: "Onboarding help needed", priority: "medium", status: "in_progress", assignee: "Customer Success", category: "onboarding", created: "2026-06-19" },
  { id: "t6", subject: "Export not working for PDF", priority: "medium", status: "resolved", assignee: "Engineering", category: "export", created: "2026-06-15" },
  { id: "t7", subject: "Account access for new hire", priority: "low", status: "closed", assignee: "Support", category: "account", created: "2026-06-08" },
  { id: "t8", subject: "Data export request GDPR", priority: "urgent", status: "in_progress", assignee: "Legal", category: "compliance", created: "2026-06-24" },
  { id: "t9", subject: "Template rendering bug", priority: "high", status: "open", assignee: "Engineering", category: "bug", created: "2026-06-25" },
  { id: "t10", subject: "Performance slow on dashboard", priority: "medium", status: "resolved", assignee: "Engineering", category: "performance", created: "2026-06-18" },
];

const STAGES = ["discovery", "proposal", "negotiation", "closed_won", "closed_lost"];

const stageColors: Record<string, string> = {
  discovery: "from-blue-600/20 to-blue-600/5 border-blue-500/20 text-blue-400",
  proposal: "from-violet-600/20 to-violet-600/5 border-violet-500/20 text-violet-400",
  negotiation: "from-amber-600/20 to-amber-600/5 border-amber-500/20 text-amber-400",
  closed_won: "from-emerald-600/20 to-emerald-600/5 border-emerald-500/20 text-emerald-400",
  closed_lost: "from-red-600/20 to-red-600/5 border-red-500/20 text-red-400",
};

const statusColor: Record<string, string> = {
  active: "green", lead: "blue", churned: "red",
  running: "green", draft: "gray", paused: "yellow", completed: "blue",
  open: "red", in_progress: "yellow", resolved: "green", closed: "gray",
  urgent: "red", high: "orange", medium: "yellow", low: "blue",
};

function ContactCard({ c }: { c: typeof contacts[0] }) {
  return (
    <Card className="p-4 hover:border-violet-500/30 transition-colors">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
          {c.name.split(" ").map(n => n[0]).join("")}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white truncate">{c.name}</span>
            <Badge color={statusColor[c.status]}>{c.status}</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{c.company} &middot; {c.position || "—"}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
            <span className="flex items-center gap-1"><Mail size={10} />{c.email}</span>
            <span className="flex items-center gap-1"><Phone size={10} />{c.phone}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            {c.tags.map(t => <Badge key={t} color="violet" className="text-[10px]">{t}</Badge>)}
            <span className={`ml-auto text-xs font-bold ${c.score >= 80 ? "text-emerald-400" : c.score >= 50 ? "text-amber-400" : "text-slate-500"}`}>{c.score}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

function DealCard({ d }: { d: typeof deals[0] }) {
  return (
    <Card className="p-3 mb-2 hover:border-violet-500/30 transition-colors cursor-grab active:cursor-grabbing">
      <p className="text-sm font-semibold text-white">{d.name}</p>
      <p className="text-xs text-slate-500 mt-0.5">{d.contact}</p>
      <div className="flex items-center justify-between mt-2">
        <span className="text-sm font-bold text-emerald-400">${d.value.toLocaleString()}</span>
        <span className="text-xs text-slate-500">{d.prob}%</span>
      </div>
      <div className="w-full h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-violet-600 to-emerald-500 rounded-full transition-all" style={{ width: `${d.prob}%` }} />
      </div>
      <p className="text-[10px] text-slate-600 mt-1">Close: {d.closeDate}</p>
    </Card>
  );
}

export default function CRMPage() {
  const [tab, setTab] = useState<Tab>("contacts");
  const [search, setSearch] = useState("");

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.company.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const filteredTickets = tickets.filter(t =>
    t.subject.toLowerCase().includes(search.toLowerCase()) ||
    t.assignee.toLowerCase().includes(search.toLowerCase())
  );

  const ed = deals.filter(d => d.stage !== "closed_won" && d.stage !== "closed_lost");
  const pipelineValue = ed.reduce((s, d) => s + d.value, 0);
  const wonDeals = deals.filter(d => d.stage === "closed_won");
  const convRate = deals.length > 0 ? Math.round((wonDeals.length / deals.length) * 100) : 0;

  return (
    <motion.div {...pageAnim}>
      <PageHeader title="CRM Platform" subtitle="Customer relationship management &middot; V119"
        actions={<><Btn variant="secondary" size="sm" icon={Filter}>Filter</Btn><Btn size="sm" icon={Plus}>Add {tab === "contacts" ? "Contact" : tab === "deals" ? "Deal" : tab === "campaigns" ? "Campaign" : "Ticket"}</Btn></>}
      />
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Contacts" value="12" delta="Active: 7" icon={Users} color="violet" />
        <StatCard label="Active Deals" value={String(ed.length)} delta={`$${pipelineValue.toLocaleString()}`} icon={Briefcase} color="blue" />
        <StatCard label="Pipeline Value" value={`$${pipelineValue.toLocaleString()}`} delta={`${convRate}% conversion`} icon={DollarSign} color="cyan" />
        <StatCard label="Open Tickets" value={String(tickets.filter(t => t.status !== "resolved" && t.status !== "closed").length)} delta="Urgent: 2" icon={Activity} color="emerald" />
      </div>
      <div className="flex items-center gap-1 mb-5 p-1 bg-card border border-white/[0.06] rounded-xl w-fit">
        {TABS.map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setSearch(""); }} className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${tab === t.id ? "bg-violet-600/30 text-violet-300 shadow-sm" : "text-slate-500 hover:text-white hover:bg-white/5"}`}>
            <t.icon size={13} /> {t.label}
          </button>
        ))}
      </div>
      <div className="relative mb-5">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder={tab === "contacts" ? "Search contacts..." : tab === "tickets" ? "Search tickets..." : "Search..."}
          className="w-full bg-[#0d0f2a] border border-white/[0.08] rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/40"
        />
      </div>
      {tab === "contacts" && (
        <div className="grid grid-cols-3 gap-3">
          {filteredContacts.map(c => <ContactCard key={c.id} c={c} />)}
        </div>
      )}
      {tab === "deals" && (
        <div className="grid grid-cols-5 gap-3">
          {STAGES.map(stage => {
            const stageDeals = deals.filter(d => d.stage === stage);
            return (
              <div key={stage} className={`p-3 rounded-xl border ${stageColors[stage]} bg-gradient-to-br`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider">{stage.replace("_", " ")}</span>
                  <span className="text-xs font-semibold opacity-70">{stageDeals.length}</span>
                </div>
                <div className="space-y-1">
                  {stageDeals.map(d => <DealCard key={d.id} d={d} />)}
                  {stageDeals.length === 0 && <p className="text-xs text-slate-600 text-center py-4">No deals</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {tab === "campaigns" && (
        <div className="grid grid-cols-2 gap-4">
          {campaigns.map(c => (
            <Card key={c.id} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-white">{c.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge color={statusColor[c.status]}>{c.status}</Badge>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">{c.type}</span>
                  </div>
                </div>
                <span className={`text-sm font-bold ${c.roi > 0 ? "text-emerald-400" : "text-slate-500"}`}>{c.roi}% ROI</span>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-3">
                <div><p className="text-[10px] text-slate-600 uppercase">Budget</p><p className="text-xs font-semibold text-white">${c.budget.toLocaleString()}</p></div>
                <div><p className="text-[10px] text-slate-600 uppercase">Spent</p><p className="text-xs font-semibold text-white">${c.spent.toLocaleString()}</p></div>
                <div><p className="text-[10px] text-slate-600 uppercase">Reach</p><p className="text-xs font-semibold text-white">{c.reach.toLocaleString()}</p></div>
              </div>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/[0.06]">
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-violet-600 to-blue-500 rounded-full" style={{ width: `${c.budget > 0 ? Math.round((c.spent / c.budget) * 100) : 0}%` }} />
                </div>
                <span className="text-[10px] text-slate-500">{c.conv} conversions</span>
              </div>
            </Card>
          ))}
        </div>
      )}
      {tab === "tickets" && (
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {["Subject", "Priority", "Status", "Assignee", "Category", "Created"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map(t => (
                <tr key={t.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 text-white font-medium text-xs">{t.subject}</td>
                  <td className="px-4 py-3"><Badge color={statusColor[t.priority]}>{t.priority}</Badge></td>
                  <td className="px-4 py-3"><Badge color={statusColor[t.status]}>{t.status.replace("_", " ")}</Badge></td>
                  <td className="px-4 py-3 text-xs text-slate-400">{t.assignee}</td>
                  <td className="px-4 py-3"><span className="text-[10px] text-slate-500 uppercase tracking-wider">{t.category}</span></td>
                  <td className="px-4 py-3 text-xs text-slate-500">{t.created}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
      {tab === "pipelines" && (
        <div className="grid grid-cols-2 gap-4">
          {[
            { name: "Enterprise Sales Pipeline", desc: "High-value enterprise deals", stages: STAGES, value: 850000, deals: 8 },
            { name: "SMB Pipeline", desc: "Small to medium business", stages: STAGES, value: 325000, deals: 5 },
          ].map(p => (
            <Card key={p.name} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-white">{p.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{p.desc}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-emerald-400">${p.value.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-500">{p.deals} deals</p>
                </div>
              </div>
              <div className="space-y-2">
                {p.stages.filter(s => s !== "closed_won" && s !== "closed_lost").map(stage => {
                  const stageDeals = deals.filter(d => d.stage === stage);
                  const stageVal = stageDeals.reduce((s, d) => s + d.value, 0);
                  const pct = p.value > 0 ? Math.round((stageVal / p.value) * 100) : 0;
                  return (
                    <div key={stage} className="flex items-center gap-3">
                      <span className="text-[10px] text-slate-500 w-20 uppercase tracking-wider">{stage}</span>
                      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${stage === "discovery" ? "bg-blue-500" : stage === "proposal" ? "bg-violet-500" : "bg-amber-500"}`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-slate-400 w-20 text-right">${stageVal.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-600 w-8 text-right">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}
