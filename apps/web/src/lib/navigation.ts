import { useRouter, usePathname } from "next/navigation";

export const screenToRoute: Record<string, string> = {
  landing: "/",
  signin: "/signin",
  signup: "/signup",
  forgot: "/forgot",
  verify: "/verify",
  onboard: "/onboarding",
  dashboard: "/dashboard",
  projects: "/dashboard/projects",
  "brand-studio": "/dashboard/brand-studio",
  "logo-maker": "/dashboard/logo-maker",
  "website-builder": "/dashboard/website-builder",
  uiux: "/dashboard/uiux",
  marketing: "/dashboard/marketing",
  "ai-image": "/dashboard/ai-image",
  presentation: "/dashboard/presentation",
  "social-media": "/dashboard/social-media",
  "email-builder": "/dashboard/email-builder",
  "form-builder": "/dashboard/form-builder",
  templates: "/dashboard/templates",
  assets: "/dashboard/assets",
  "brand-guidelines": "/dashboard/brand-guidelines",
  "ai-agents": "/dashboard/ai-agents",
  "mcp-tools": "/dashboard/mcp-tools",
  "knowledge-hub": "/dashboard/knowledge-hub",
  "cms-dashboard": "/dashboard/cms-dashboard",
  workflow: "/dashboard/workflow",
  automation: "/dashboard/automation",
  export: "/dashboard/export",
  marketplace: "/dashboard/marketplace",
  creator: "/dashboard/creator",
  crm: "/dashboard/crm",
  collaboration: "/dashboard/collaboration",
  lms: "/dashboard/lms",
  team: "/dashboard/team",
  activity: "/dashboard/activity",
  analytics: "/dashboard/analytics",
  integrations: "/dashboard/integrations",
  security: "/dashboard/security",
  notifications: "/dashboard/notifications",
  help: "/dashboard/help",
  docs: "/dashboard/docs",
  changelog: "/dashboard/changelog",
  settings: "/dashboard/settings",
  billing: "/dashboard/billing",
  "api-keys": "/dashboard/api-keys",
  profile: "/dashboard/profile",
  "mission-control": "/dashboard/mission-control",
  terms: "/legal/terms",
  privacy: "/legal/privacy",
  cookie: "/legal/cookie",
  license: "/legal/license",
  "404": "/404",
  maintenance: "/maintenance",
};

const routeToScreen: Record<string, string> = {};
for (const [screen, route] of Object.entries(screenToRoute)) {
  routeToScreen[route] = screen;
}

export function useNavigate() {
  const router = useRouter();
  return (screen: string) => {
    const path = screenToRoute[screen];
    if (path) router.push(path);
  };
}

export function useCurrentScreen(): string {
  const pathname = usePathname();
  return routeToScreen[pathname] ?? "dashboard";
}
