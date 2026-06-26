"use client";
import { motion } from "motion/react";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Btn } from "../components/shared";
import type { Screen } from "../types";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

export default function NotFoundPage({ navigate }: { navigate: (s: Screen) => void }) {
  return (
    <div className="min-h-screen bg-[#07081a] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-radial from-violet-900/20 via-transparent to-transparent"
        />
      </div>
      <motion.div {...pageAnim} className="text-center relative z-10">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500 mb-4"
        >
          404
        </motion.div>
        <div className="w-24 h-24 mx-auto mb-6">
          <img src="/3d-icons/clock-dynamic-premium.png" alt="404" className="w-full h-full object-contain opacity-60" />
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-3">Page Not Found</h1>
        <p className="text-slate-500 max-w-md mx-auto mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Btn variant="secondary" icon={ArrowLeft} onClick={() => window.history.back()}>Go Back</Btn>
          <Btn variant="primary" icon={Home} onClick={() => navigate("landing")}>Go Home</Btn>
        </div>
        <div className="mt-12 flex items-center justify-center gap-2 text-xs text-slate-600">
          <Search size={12} />
          Looking for something? Try the <button onClick={() => navigate("help")} className="text-violet-400 hover:underline ml-1">Help Center</button>
        </div>
      </motion.div>
    </div>
  );
}
