import { useState } from "react";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { Card, Badge } from "../components/shared";
import type { Screen } from "../types";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

interface Section { id: string; title: string; content: string }

const SECTIONS: Section[] = [
  { id: "introduction", title: "Introduction", content: "These terms and conditions outline the rules and regulations for the use of NEXORA's platform. By accessing this platform, we assume you accept these terms and conditions. Do not continue to use NEXORA if you do not agree to take all of the terms and conditions stated on this page." },
  { id: "license", title: "License to Use", content: "Unless otherwise stated, NEXORA and/or its licensors own the intellectual property rights for all material on the platform. All intellectual property rights are reserved. You may view and/or print pages from the platform for your own personal use subject to restrictions set in these terms and conditions." },
  { id: "user-obligations", title: "User Obligations", content: "You agree to use the platform only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the platform. Prohibited behavior includes harassing or causing distress or inconvenience to any other user, transmitting obscene or offensive content, or disrupting the normal flow of dialogue within the platform." },
  { id: "subscription", title: "Subscription & Billing", content: "Some features of the platform require a paid subscription. You will be billed in advance on a recurring basis. Your subscription will automatically renew unless you cancel at least 24 hours before the end of the current period. Refunds are provided at our discretion in accordance with our refund policy." },
  { id: "data-privacy", title: "Data Privacy", content: "Your privacy is important to us. We collect and process personal data in accordance with our Privacy Policy. By using the platform, you consent to such processing and warrant that all data provided by you is accurate. We implement reasonable security measures to protect your data from unauthorized access." },
  { id: "limitations", title: "Limitation of Liability", content: "In no event shall NEXORA, nor any of its officers, directors, and employees, be held liable for anything arising out of or in any way connected with your use of this platform. NEXORA shall not be liable for any indirect, consequential, or special liability arising out of or in any way related to your use of this platform." },
  { id: "termination", title: "Termination", content: "We may terminate or suspend your account and bar access to the platform immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including without limitation a breach of the Terms. If you wish to terminate your account, you may simply discontinue using the platform." },
  { id: "governing-law", title: "Governing Law", content: "These terms will be governed by and construed in accordance with the laws of the jurisdiction in which NEXORA operates, and you submit to the non-exclusive jurisdiction of the courts located there for the resolution of any disputes." },
];

export default function LegalPage({ title, content, navigate }: {
  title: string; content: string | string[]; navigate: (s: Screen) => void;
}) {
  const [activeSection, setActiveSection] = useState("introduction");

  return (
    <div className="min-h-screen bg-[#07081a] text-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <button onClick={() => navigate("landing")} className="hover:text-white transition-colors">Home</button>
          <ChevronRight size={12} />
          <span className="text-white font-medium capitalize">{title}</span>
        </div>
        <div className="flex gap-8">
          <nav className="w-56 flex-shrink-0 space-y-1 sticky top-8 self-start">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                  activeSection === s.id
                    ? "bg-violet-500/10 text-violet-300 font-semibold border-l-2 border-violet-500"
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]"
                }`}
              >
                {s.title}
              </button>
            ))}
          </nav>
          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <Badge color="violet">Legal</Badge>
              <h1 className="text-3xl font-extrabold mt-3 mb-2 capitalize">{title}</h1>
              <p className="text-sm text-slate-500">Last updated: January 1, 2024</p>
            </div>
            <Card className="p-8 space-y-8">
              {SECTIONS.map((s) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  id={s.id}
                >
                  <h2 className="text-lg font-bold text-white mb-3">{s.title}</h2>
                  <p className="text-sm text-slate-400 leading-relaxed">{s.content}</p>
                </motion.div>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
