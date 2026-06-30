"use client";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Trophy, Medal, Award, TrendingUp, Crown, Star, Zap } from "lucide-react";
import { Card, Badge, StatCard, PageHeader, Btn, Skeleton } from "../components/shared";
import { gamificationService, type LeaderboardEntry, type UserGamificationStats } from "@/services/gamification";

const pageAnim = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } }, exit: { opacity: 0, y: -8, transition: { duration: 0.15 } } };

const RANK_COLORS = ["text-amber-400", "text-gray-300", "text-amber-700"];
const RANK_ICONS = [Crown, Medal, Award];

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [stats, setStats] = useState<UserGamificationStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [lb, st] = await Promise.all([
          gamificationService.leaderboard.get(100),
          gamificationService.stats.get(),
        ]);
        setLeaderboard(lb);
        setStats(st);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  return (
    <motion.div {...pageAnim}>
      <PageHeader title="Leaderboard" subtitle="Compete, earn points, and unlock achievements" />
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Your Points" value={stats?.points.toString() || "0"} icon={Zap} color="violet" />
        <StatCard label="Your Level" value={stats?.level || "Beginner"} icon={Trophy} color="amber" />
        <StatCard label="Achievements" value={(stats?.achievements?.length || 0).toString()} icon={Award} color="emerald" />
        <StatCard label="Global Rank" value={leaderboard.find(e => e.userId === "me")?.rank?.toString() || "-"} icon={TrendingUp} color="blue" />
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="p-0 overflow-hidden">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <h2 className="font-semibold text-white">Top Contributors</h2>
              <Badge color="violet">{leaderboard.length} users</Badge>
            </div>
            {loading ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 mx-4 my-1" />) :
              leaderboard.map((e, i) => (
                <div key={e.userId} className={`flex items-center justify-between px-4 py-3 ${i % 2 === 0 ? "bg-white/[0.02]" : ""} hover:bg-white/[0.04] transition-colors`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${i < 3 ? `bg-amber-600/20 ${RANK_COLORS[i]}` : "bg-[#0c1022] text-gray-500"}`}>
                      {i < 3 ? <>{RANK_ICONS[i]({ size: 16 })}</> : `#${e.rank}`}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{e.userName}</p>
                      <p className="text-xs text-gray-500">{e.level} · {e.achievements.length} achievements</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">{e.points.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">pts</p>
                  </div>
                </div>
              ))
            }
          </Card>
        </div>
        <div>
          <Card className="p-5">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2"><Award size={16} className="text-violet-400" />Achievements</h2>
            {stats?.achievements?.length ? stats.achievements.map(a => (
              <div key={a.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                <span className="text-xl">{a.icon}</span>
                <div>
                  <p className="text-sm font-medium text-white">{a.name}</p>
                  <p className="text-xs text-gray-500">{a.description}</p>
                </div>
              </div>
            )) : <p className="text-gray-500 text-sm">Complete tasks to earn achievements</p>}
          </Card>
          <Card className="p-5 mt-4">
            <h2 className="font-semibold text-white mb-3 flex items-center gap-2"><Zap size={16} className="text-violet-400" />Levels</h2>
            <div className="space-y-2">
              {[{ level: "Beginner", min: 0 }, { level: "Bronze", min: 500 }, { level: "Silver", min: 1000 }, { level: "Gold", min: 2000 }, { level: "Platinum", min: 5000 }, { level: "Diamond", min: 10000 }].map(l => (
                <div key={l.level} className={`flex items-center justify-between text-sm ${stats?.level === l.level ? "text-violet-300" : "text-gray-500"}`}>
                  <span>{l.level}</span>
                  <span>{l.min.toLocaleString()} pts</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
