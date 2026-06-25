import { motion } from "motion/react";
import { User, Mail, Phone, Globe, MapPin, Building, Calendar, AtSign, Crown, LogOut, Edit2, Bell, Shield, Eye } from "lucide-react";
import { Btn, Card, Badge, Avatar, Toggle, PageHeader, Input } from "../components/shared";
import type { Screen } from "../types";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const STATS = [
  { label: "Projects", value: "24" },
  { label: "Assets", value: "1.2K" },
  { label: "Teams", value: "3" },
];

export default function ProfilePage({ navigate }: { navigate: (s: Screen) => void }) {
  return (
    <motion.div {...pageAnim}>
      <PageHeader title="Profile" subtitle="Manage your personal information and preferences" />
      <div className="grid grid-cols-3 gap-5">
        <div className="space-y-4">
          <Card className="p-6 text-center">
            <div className="relative inline-block">
              <Avatar name="Alex Johnson" size="lg" />
              <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-violet-600 border-2 border-[#0d0f2a] flex items-center justify-center hover:bg-violet-500 transition-colors">
                <Edit2 size={10} className="text-white" />
              </button>
            </div>
            <h2 className="text-lg font-bold text-white mt-3">Alex Johnson</h2>
            <p className="text-sm text-slate-500">Creative Director</p>
            <div className="mt-2">
              <Badge color="violet"><Crown size={10} /> Pro Plan</Badge>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-5 py-4 border-t border-white/[0.06]">
              {STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-lg font-bold text-white">{s.value}</p>
                  <p className="text-[10px] text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>
            <Btn variant="danger" className="w-full justify-center mt-4" icon={LogOut} onClick={() => navigate("signin")}>Sign Out</Btn>
          </Card>
        </div>
        <div className="col-span-2 space-y-5">
          <Card className="p-5">
            <h3 className="font-bold text-white text-sm mb-4">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Full Name", value: "Alex Johnson", icon: User },
                { label: "Email", value: "alex@designstudio.com", icon: Mail },
                { label: "Phone", value: "+1 (555) 123-4567", icon: Phone },
                { label: "Website", value: "designstudio.com", icon: Globe },
                { label: "Location", value: "San Francisco, CA", icon: MapPin },
                { label: "Company", value: "Design Studio Inc.", icon: Building },
                { label: "Role", value: "Creative Director", icon: AtSign },
                { label: "Member Since", value: "Jan 2025", icon: Calendar },
              ].map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.label} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                    <Icon size={14} className="text-slate-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">{f.label}</p>
                      <p className="text-sm text-white font-semibold truncate">{f.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <Btn variant="primary" className="mt-4" icon={Edit2}>Edit Profile</Btn>
          </Card>
          <Card className="p-5">
            <h3 className="font-bold text-white text-sm mb-4">Preferences</h3>
            <div className="space-y-4">
              {[
                { label: "Email Notifications", desc: "Receive email updates about your projects", icon: Bell, checked: true },
                { label: "Two-Factor Auth", desc: "Add an extra layer of security", icon: Shield, checked: false },
                { label: "Public Profile", desc: "Show your profile to team members", icon: Eye, checked: true },
              ].map((pref) => {
                const Icon = pref.icon;
                return (
                  <div key={pref.label} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                    <Icon size={14} className="text-slate-500" />
                    <div className="flex-1">
                      <p className="text-sm text-white font-semibold">{pref.label}</p>
                      <p className="text-xs text-slate-500">{pref.desc}</p>
                    </div>
                    <Toggle checked={pref.checked} onChange={() => {}} />
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
