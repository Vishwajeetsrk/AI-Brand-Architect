const en = {
  nav: {
    dashboard: "Dashboard",
    projects: "Projects",
    analytics: "Analytics",
    settings: "Settings",
    billing: "Billing",
    help: "Help & Support",
  },
  common: {
    loading: "Loading...",
    error: "Something went wrong",
    retry: "Try Again",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    create: "Create",
    search: "Search",
    noResults: "No results found",
    seeAll: "See all",
    viewAll: "View all",
    learnMore: "Learn more",
    getStarted: "Get started",
  },
  dashboard: {
    title: "Dashboard",
    subtitle: "Welcome back, {{name}}! Here's what's happening.",
    newProject: "New Project",
    growthOverview: "Growth Overview",
    recentProjects: "Recent Projects",
    quickActions: "Quick Actions",
    recentActivity: "Recent Activity",
  },
  projects: {
    title: "Projects",
    newProject: "New Project",
    total: "Total",
    active: "Active",
    starred: "Starred",
    contributors: "Contributors",
    noResults: "No projects found",
    noResultsDesc: "Try adjusting your search or filter criteria.",
  },
  settings: {
    title: "Settings",
    appearance: "Appearance",
    theme: "Theme",
    language: "Language",
    notifications: "Notifications",
  },
};

type DeepRecord = { [key: string]: string | DeepRecord };
type TranslationMap = typeof en;

const translations: Record<string, TranslationMap> = { en };

export type Lang = keyof typeof translations;

export function addTranslation(lang: string, map: TranslationMap) {
  (translations as any)[lang] = map;
}

export function t(key: string, lang: string, params?: Record<string, string>): string {
  const map = (translations[lang] || translations.en) as DeepRecord;
  const value = key.split(".").reduce((acc: any, part) => acc?.[part], map) as string | undefined;
  if (!value) return key;
  if (!params) return value;
  return value.replace(/\{\{(\w+)\}\}/g, (_, k) => params[k] ?? `{{${k}}}`);
}

export type { TranslationMap };
export default translations;
