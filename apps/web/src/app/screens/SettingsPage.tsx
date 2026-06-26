"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Save, Moon, Sun, Monitor, Shield, Bell, Laptop, User } from "lucide-react";
import { PageHeader, Card, Avatar, Input, Btn, Toggle, Badge } from "../components/shared";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({ email: true, push: true, weekly: false, marketing: false });
  const [appearance, setAppearance] = useState({ theme: "dark", density: "comfortable" });
  const [tab, setTab] = useState("profile");
  const tabs = ["profile", "appearance", "notifications", "security", "integrations"];
  return (
    <motion.div {...pageAnim}>
      <PageHeader title="Settings" />
      <div className="flex gap-5">
        <div className="w-44 flex-shrink-0 space-y-0.5">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all capitalize ${tab === t ? "bg-violet-600/20 text-violet-300" : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]"}`}>{t}</button>
          ))}
        </div>
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {tab === "profile" && (
              <motion.div key="profile" {...pageAnim}>
                <Card className="p-6">
                  <h3 className="font-bold text-white mb-5">Profile Settings</h3>
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar name="Alex Johnson" size="lg" />
                    <div>
                      <p className="font-semibold text-white text-sm">Alex Johnson</p>
                      <p className="text-xs text-slate-500">alex@designstudio.com</p>
                      <Btn variant="outline" size="sm" className="mt-2">Change Avatar</Btn>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Full Name", value: "Alex Johnson" },
                      { label: "Email", value: "alex@designstudio.com" },
                      { label: "Company", value: "Design Studio Co." },
                      { label: "Role", value: "Brand Designer" },
                    ].map((f) => (
                      <div key={f.label}>
                        <label className="text-xs text-slate-500 mb-1.5 block">{f.label}</label>
                        <Input value={f.value} />
                      </div>
                    ))}
                  </div>
                  <Btn variant="primary" className="mt-5" icon={Save}>Save Changes</Btn>
                </Card>
              </motion.div>
            )}
            {tab === "notifications" && (
              <motion.div key="notif" {...pageAnim}>
                <Card className="p-6">
                  <h3 className="font-bold text-white mb-5">Notification Preferences</h3>
                  <div className="space-y-4">
                    {Object.entries(notifications).map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between py-3 border-b border-white/[0.05]">
                        <div>
                          <p className="text-sm font-medium text-white capitalize">{k.replace(/([A-Z])/g, " $1")} notifications</p>
                          <p className="text-xs text-slate-500">Receive {k} notifications for important events</p>
                        </div>
                        <Toggle checked={v} onChange={() => setNotifications((p) => ({ ...p, [k]: !v }))} />
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
            {tab === "appearance" && (
              <motion.div key="appear" {...pageAnim}>
                <Card className="p-6">
                  <h3 className="font-bold text-white mb-5">Appearance</h3>
                  <div className="space-y-5">
                    <div>
                      <label className="text-xs text-slate-500 mb-2 block">Theme</label>
                      <div className="flex gap-3">
                        {["dark", "light", "system"].map((t) => (
                          <button key={t} onClick={() => setAppearance((p) => ({ ...p, theme: t }))} className={`flex-1 py-3 rounded-xl border text-sm font-medium capitalize transition-all ${appearance.theme === t ? "border-violet-500/50 bg-violet-500/10 text-violet-300" : "border-white/[0.07] text-slate-500 hover:text-slate-300"}`}>
                            {t === "dark" ? <Moon size={16} className="mx-auto mb-1" /> : t === "light" ? <Sun size={16} className="mx-auto mb-1" /> : <Monitor size={16} className="mx-auto mb-1" />}
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-2 block">Density</label>
                      <div className="flex gap-2">
                        {["compact", "comfortable", "spacious"].map((d) => (
                          <button key={d} onClick={() => setAppearance((p) => ({ ...p, density: d }))} className={`px-4 py-2 rounded-lg text-xs font-medium capitalize transition-all border ${appearance.density === d ? "border-violet-500/50 bg-violet-500/10 text-violet-300" : "border-white/[0.07] text-slate-500"}`}>{d}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
            {tab === "security" && (
              <motion.div key="sec" {...pageAnim}>
                <Card className="p-6">
                  <h3 className="font-bold text-white mb-5">Security Settings</h3>
                  <div className="space-y-4">
                    {[
                      { title: "Two-Factor Authentication", desc: "Add an extra layer of security", icon: Shield, enabled: true },
                      { title: "Login Alerts", desc: "Get notified of new sign-ins", icon: Bell, enabled: true },
                      { title: "Session Management", desc: "Manage active sessions", icon: Laptop, enabled: false },
                    ].map((s) => {
                      const Icon = s.icon;
                      return (
                        <div key={s.title} className="flex items-center gap-3 p-4 rounded-xl border border-white/[0.06] hover:border-violet-500/20 transition-colors">
                          <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center"><Icon size={16} className="text-violet-400" /></div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-white">{s.title}</p>
                            <p className="text-xs text-slate-500">{s.desc}</p>
                          </div>
                          <Toggle checked={s.enabled} onChange={() => {}} />
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </motion.div>
            )}
            {tab === "integrations" && (
              <motion.div key="int" {...pageAnim}>
                <Card className="p-6">
                  <h3 className="font-bold text-white mb-5">Connected Apps</h3>
                  <div className="space-y-3">
                    {[
                      { name: "Figma", desc: "Design collaboration", connected: true },
                      { name: "Slack", desc: "Team notifications", connected: true },
                      { name: "GitHub", desc: "Code repository", connected: false },
                      { name: "Zapier", desc: "Workflow automation", connected: false },
                    ].map((app) => (
                      <div key={app.name} className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.06]">
                        <div className="w-9 h-9 rounded-xl bg-[#111336] flex items-center justify-center text-sm font-bold text-violet-400">{app.name[0]}</div>
                        <div className="flex-1"><p className="text-sm font-semibold text-white">{app.name}</p><p className="text-xs text-slate-500">{app.desc}</p></div>
                        <Btn variant={app.connected ? "danger" : "outline"} size="sm">{app.connected ? "Disconnect" : "Connect"}</Btn>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
