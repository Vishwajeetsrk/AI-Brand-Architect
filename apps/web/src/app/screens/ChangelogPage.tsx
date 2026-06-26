import { motion } from "motion/react";
import { Clock } from "lucide-react";
import { Card, Badge, PageHeader } from "../components/shared";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const VERSIONS = [
  {
    version: "v2.0.0", date: "June 1, 2025", badges: [{ label: "Major", color: "violet" as const }, { label: "New", color: "blue" as const }],
    items: ["Revamped AI engine with 3x faster generation", "New brand studio interface with real-time preview", "Real-time collaboration for teams", "Advanced analytics dashboard with custom reports", "Improved export pipeline with 10+ formats", "New API endpoints for brand management"],
  },
  {
    version: "v1.9.0", date: "April 15, 2025", badges: [{ label: "Update", color: "blue" as const }, { label: "New", color: "green" as const }],
    items: ["Added MCP tools support for extended functionality", "Improved export options with batch processing", "New API endpoints for asset management", "Performance optimizations across the platform", "Enhanced search with fuzzy matching", "Updated UI components library"],
  },
  {
    version: "v1.8.0", date: "February 20, 2025", badges: [{ label: "Update", color: "blue" as const }],
    items: ["Knowledge hub integration with search", "CMS dashboard with content management", "Bug fixes and stability improvements", "Reduced memory usage by 40%", "Improved mobile responsiveness"],
  },
  {
    version: "v1.7.0", date: "January 5, 2025", badges: [{ label: "Update", color: "blue" as const }, { label: "Fix", color: "yellow" as const }],
    items: ["Workflow builder beta release", "New template categories added", "Enhanced security features with 2FA", "Fixed rate limiting issues on API", "Improved error handling and logging"],
  },
];

export default function ChangelogPage() {
  return (
    <motion.div {...pageAnim}>
      <PageHeader title="Changelog" subtitle="Track every update, improvement, and fix" />
      <div className="space-y-4">
        {VERSIONS.map((v) => (
          <Card key={v.version} className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <Clock size={16} className="text-violet-400" />
              <h3 className="font-bold text-white text-lg">{v.version}</h3>
              <div className="flex gap-1.5">
                {v.badges.map((b) => (
                  <Badge key={b.label} color={b.color}>{b.label}</Badge>
                ))}
              </div>
              <span className="text-xs text-slate-500">{v.date}</span>
            </div>
            <ul className="space-y-2.5">
              {v.items.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500/50 mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
