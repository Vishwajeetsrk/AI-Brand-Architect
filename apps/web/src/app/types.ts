export type Screen =
  | "landing" | "signin" | "signup" | "forgot" | "verify"
  | "onboard"
  | "dashboard" | "projects" | "brand-studio" | "logo-maker" | "website-builder"
  | "uiux" | "marketing" | "ai-image" | "presentation" | "social-media"
  | "email-builder" | "form-builder" | "templates" | "assets" | "brand-guidelines"
  | "ai-agents" | "workflow" | "export" | "team" | "activity"
  | "analytics" | "integrations" | "settings" | "billing" | "api-keys"
  | "notifications" | "profile" | "help" | "docs" | "changelog"
  | "mcp-tools" | "knowledge-hub" | "cms-dashboard" | "mission-control" | "marketplace" | "security"
  | "ai-monitoring"
  | "collaboration"
  | "automation"
  | "lms"
  | "crm"
  | "creator"
  | "pricing" | "terms" | "privacy" | "cookie" | "license" | "404" | "maintenance";

export interface NavItem { id: Screen; label: string; icon: React.ElementType; badge?: string }
export interface NavSection { label: string; items: NavItem[] }
