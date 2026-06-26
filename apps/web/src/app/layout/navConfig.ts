import {
  LayoutDashboard, FolderOpen, Wand2, Sparkles, Globe, Layout,
  Megaphone, ImagePlus, Monitor, Share2, Mail, Clipboard,
  Copy, Layers, Palette, Bot, GitBranch, Upload, Users, Activity,
  BarChart3, Settings, CreditCard, Key, Bell, User, HelpCircle,
  BookOpen, Clock, Terminal, FileText, Gauge, Plug, Shield, ShoppingCart,
  GraduationCap,
} from "lucide-react";
import type { NavItem, NavSection, Screen } from "../types";

export const NAV_SECTIONS: NavSection[] = [
  {
    label: "Overview",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "mission-control", label: "Mission Control", icon: Gauge, badge: "Live" },
      { id: "projects", label: "Projects", icon: FolderOpen, badge: "24" },
    ],
  },
  {
    label: "AI Studio",
    items: [
      { id: "brand-studio", label: "Brand Studio", icon: Wand2 },
      { id: "logo-maker", label: "Logo Maker", icon: Sparkles },
      { id: "website-builder", label: "Website Builder", icon: Globe },
      { id: "uiux", label: "UI/UX Designer", icon: Layout },
      { id: "marketing", label: "Marketing Studio", icon: Megaphone },
      { id: "ai-image", label: "AI Image Generator", icon: ImagePlus, badge: "New" },
      { id: "presentation", label: "Presentations", icon: Monitor },
      { id: "social-media", label: "Social Media", icon: Share2 },
      { id: "email-builder", label: "Email Builder", icon: Mail },
      { id: "form-builder", label: "Form Builder", icon: Clipboard },
    ],
  },
  {
    label: "Library",
    items: [
      { id: "templates", label: "Templates", icon: Copy },
      { id: "knowledge-hub", label: "Knowledge Hub", icon: BookOpen },
      { id: "lms", label: "Learning Platform", icon: GraduationCap, badge: "New" },
      { id: "assets", label: "Assets Library", icon: Layers },
      { id: "brand-guidelines", label: "Brand Guidelines", icon: Palette },
    ],
  },
  {
    label: "Workflow",
    items: [
      { id: "ai-agents", label: "AI Agents", icon: Bot },
      { id: "mcp-tools", label: "MCP Tools", icon: Terminal },
      { id: "cms-dashboard", label: "CMS Dashboard", icon: FileText },
      { id: "workflow", label: "Workflow Builder", icon: GitBranch },
      { id: "export", label: "Export Center", icon: Upload },
      { id: "marketplace", label: "Agent Marketplace", icon: ShoppingCart, badge: "New" },
      { id: "creator", label: "Creator Studio", icon: Crown, badge: "New" },
    ],
  },
  {
    label: "CRM",
    items: [
      { id: "crm", label: "CRM Platform", icon: Contact, badge: "V119" },
    ],
  },
  {
    label: "Team",
    items: [
      { id: "team", label: "Team & Collaboration", icon: Users },
      { id: "collaboration", label: "Collaboration Hub", icon: MessageSquare, badge: "New" },
      { id: "activity", label: "Activity & Audit Logs", icon: Activity },
    ],
  },
  {
    label: "Insights",
    items: [
      { id: "analytics", label: "Analytics", icon: BarChart3 },
      { id: "integrations", label: "Integrations", icon: Plug },
    ],
  },
  {
    label: "Security",
    items: [
      { id: "security", label: "Security Platform", icon: Shield },
    ],
  },
];

export const BOTTOM_NAV: NavItem[] = [
  { id: "notifications", label: "Notifications", icon: Bell, badge: "5" },
  { id: "help", label: "Help Center", icon: HelpCircle },
  { id: "docs", label: "Documentation", icon: BookOpen },
  { id: "changelog", label: "Changelog", icon: Clock },
  { id: "settings", label: "Settings", icon: Settings },
];

export const APP_SCREENS: Screen[] = [
  "dashboard", "projects", "brand-studio", "logo-maker", "website-builder",
  "uiux", "marketing", "ai-image", "presentation", "social-media",
  "email-builder", "form-builder", "templates", "assets", "brand-guidelines",
  "ai-agents", "workflow", "export", "team", "activity",
  "crm",
  "analytics", "integrations", "settings", "billing", "api-keys",
  "notifications", "profile", "help", "docs", "changelog",
  "mission-control", "mcp-tools", "knowledge-hub", "cms-dashboard", "automation", "security",
  "collaboration",
  "marketplace",
  "lms",
  "creator",
];

export const LABEL_MAP: Partial<Record<Screen, string>> = {
  "brand-studio": "Brand Studio", "logo-maker": "Logo Maker",
  "website-builder": "Website Builder", "uiux": "UI/UX Designer",
  "marketing": "Marketing Studio", "ai-image": "AI Image Generator",
  "presentation": "Presentations", "social-media": "Social Media Studio",
  "email-builder": "Email Builder", "form-builder": "Form Builder",
  "assets": "Assets Library", "brand-guidelines": "Brand Guidelines",
  "ai-agents": "AI Agents", "workflow": "Workflow Builder",
  "export": "Export Center", "team": "Team & Collaboration",
  "activity": "Activity Logs", "analytics": "Analytics",
  "integrations": "Integrations", "settings": "Settings",
  "billing": "Billing & Subscription", "api-keys": "API Keys",
  "notifications": "Notifications", "profile": "User Profile",
  "help": "Help Center", "docs": "Documentation", "changelog": "Changelog",
  "dashboard": "Dashboard", "projects": "Projects", "templates": "Templates",
  "mission-control": "Mission Control", "mcp-tools": "MCP Tools",
  "knowledge-hub": "Knowledge Hub",   "cms-dashboard": "CMS Dashboard",
  "marketplace": "Agent Marketplace",
  "creator": "Creator Studio",
  "automation": "Automation Platform",
  "crm": "CRM Platform",
  "security": "Security Platform",
  "collaboration": "Collaboration Hub",
  "lms": "Learning Platform",
};
