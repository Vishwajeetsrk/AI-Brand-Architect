"use client";
import { motion } from "motion/react";
import { Card } from "../components/shared";
import type { Screen } from "../types";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

export default function AuthCard({ children, title, subtitle, navigate }: {
  children: React.ReactNode; title: string; subtitle?: string; navigate: (s: Screen) => void;
}) {
  return (
    <div className="min-h-screen bg-[#07081a] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-20 left-20 w-64 h-64 bg-violet-900/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-blue-900/20 rounded-full blur-3xl" />
      <motion.div {...pageAnim} className="w-full max-w-md relative z-10">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <img src="/logo.svg" alt="NEXORA" className="w-11 h-11" />
        </div>
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
          {subtitle && <p className="text-sm text-slate-500 mb-6">{subtitle}</p>}
          {children}
        </Card>
      </motion.div>
    </div>
  );
}
