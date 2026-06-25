import { useState, lazy, Suspense } from "react";
import { AnimatePresence } from "motion/react";
import { Grid, Loader2 } from "lucide-react";
import { Btn } from "./components/shared";
import { AppLayout, APP_SCREENS, LABEL_MAP } from "./layout";
import type { Screen } from "./types";

const LandingPage = lazy(() => import("./screens/LandingPage"));
const SignInPage = lazy(() => import("./screens/SignInPage"));
const SignUpPage = lazy(() => import("./screens/SignUpPage"));
const ForgotPage = lazy(() => import("./screens/ForgotPage"));
const VerifyPage = lazy(() => import("./screens/VerifyPage"));
const OnboardingPage = lazy(() => import("./screens/OnboardingPage"));
const DashboardPage = lazy(() => import("./screens/DashboardPage"));
const ProjectsPage = lazy(() => import("./screens/ProjectsPage"));
const BrandStudioPage = lazy(() => import("./screens/BrandStudioPage"));
const LogoMakerPage = lazy(() => import("./screens/LogoMakerPage"));
const AIImagePage = lazy(() => import("./screens/AIImagePage"));
const TemplatesPage = lazy(() => import("./screens/TemplatesPage"));
const AssetsPage = lazy(() => import("./screens/AssetsPage"));
const TeamPage = lazy(() => import("./screens/TeamPage"));
const AnalyticsPage = lazy(() => import("./screens/AnalyticsPage"));
const SettingsPage = lazy(() => import("./screens/SettingsPage"));
const BillingPage = lazy(() => import("./screens/BillingPage"));
const APIKeysPage = lazy(() => import("./screens/APIKeysPage"));
const IntegrationsPage = lazy(() => import("./screens/IntegrationsPage"));
const NotificationsPage = lazy(() => import("./screens/NotificationsPage"));
const HelpPage = lazy(() => import("./screens/HelpPage"));
const DocsPage = lazy(() => import("./screens/DocsPage"));
const ChangelogPage = lazy(() => import("./screens/ChangelogPage"));
const MissionControlPage = lazy(() => import("./screens/MissionControlPage"));
const MCPToolsPage = lazy(() => import("./screens/MCPToolsPage"));
const KnowledgeHubPage = lazy(() => import("./screens/KnowledgeHubPage"));
const CMSDashboardPage = lazy(() => import("./screens/CMSDashboardPage"));
const AIAgentsPage = lazy(() => import("./screens/AIAgentsPage"));
const WorkflowPage = lazy(() => import("./screens/WorkflowPage"));
const ExportPage = lazy(() => import("./screens/ExportPage"));
const ActivityPage = lazy(() => import("./screens/ActivityPage"));
const BrandGuidelinesPage = lazy(() => import("./screens/BrandGuidelinesPage"));
const ProfilePage = lazy(() => import("./screens/ProfilePage"));
const LegalPage = lazy(() => import("./screens/LegalPage"));
const NotFoundPage = lazy(() => import("./screens/NotFoundPage"));
const MaintenancePage = lazy(() => import("./screens/MaintenancePage"));
const MarketingPage = lazy(() => import("./screens/MarketingPage"));
const SocialMediaPage = lazy(() => import("./screens/SocialMediaPage"));
const EmailBuilderPage = lazy(() => import("./screens/EmailBuilderPage"));
const WebsiteBuilderPage = lazy(() => import("./screens/WebsiteBuilderPage"));
const UIUXPage = lazy(() => import("./screens/UIUXPage"));
const PresentationPage = lazy(() => import("./screens/PresentationPage"));
const FormBuilderPage = lazy(() => import("./screens/FormBuilderPage"));

function Loader() {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={24} className="text-violet-400 animate-spin" />
    </div>
  );
}

function ScreenFallback({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<Loader />}>{children}</Suspense>;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const navigate = (s: Screen) => setScreen(s);

  const isApp = APP_SCREENS.includes(screen);
  const isPublic = ["landing", "signin", "signup", "forgot", "verify"].includes(screen);
  const isOnboard = screen === "onboard";
  const isLegal = ["terms", "privacy", "cookie", "license"].includes(screen);
  const isUtility = ["404", "maintenance"].includes(screen);

  const renderScreen = () => {
    switch (screen) {
      case "landing": return <LandingPage navigate={navigate} />;
      case "signin": return <SignInPage navigate={navigate} />;
      case "signup": return <SignUpPage navigate={navigate} />;
      case "forgot": return <ForgotPage navigate={navigate} />;
      case "verify": return <VerifyPage navigate={navigate} />;
      case "onboard": return <OnboardingPage navigate={navigate} />;
      case "dashboard": return <DashboardPage navigate={navigate} />;
      case "projects": return <ProjectsPage navigate={navigate} />;
      case "brand-studio": return <BrandStudioPage navigate={navigate} />;
      case "logo-maker": return <LogoMakerPage />;
      case "ai-image": return <AIImagePage />;
      case "templates": return <TemplatesPage />;
      case "assets": return <AssetsPage />;
      case "team": return <TeamPage />;
      case "analytics": return <AnalyticsPage />;
      case "settings": return <SettingsPage />;
      case "billing": return <BillingPage navigate={navigate} />;
      case "api-keys": return <APIKeysPage />;
      case "integrations": return <IntegrationsPage />;
      case "notifications": return <NotificationsPage />;
      case "help": return <HelpPage navigate={navigate} />;
      case "docs": return <DocsPage />;
      case "changelog": return <ChangelogPage />;
      case "mission-control": return <MissionControlPage navigate={navigate} />;
      case "mcp-tools": return <MCPToolsPage />;
      case "knowledge-hub": return <KnowledgeHubPage />;
      case "cms-dashboard": return <CMSDashboardPage />;
      case "ai-agents": return <AIAgentsPage />;
      case "workflow": return <WorkflowPage />;
      case "export": return <ExportPage />;
      case "activity": return <ActivityPage />;
      case "brand-guidelines": return <BrandGuidelinesPage />;
      case "profile": return <ProfilePage navigate={navigate} />;
      case "marketing": return <MarketingPage />;
      case "social-media": return <SocialMediaPage />;
      case "email-builder": return <EmailBuilderPage />;
      case "website-builder": return <WebsiteBuilderPage />;
      case "uiux": return <UIUXPage />;
      case "presentation": return <PresentationPage />;
      case "form-builder": return <FormBuilderPage />;
      case "terms": return <LegalPage title="Terms of Service" navigate={navigate} content={["Acceptance of Terms", "Use License", "Disclaimer", "Limitations", "Privacy Policy", "Governing Law", "Changes to Terms"]} />;
      case "privacy": return <LegalPage title="Privacy Policy" navigate={navigate} content={["Information We Collect", "How We Use Information", "Information Sharing", "Data Security", "Cookie Policy", "Your Rights", "Contact Us"]} />;
      case "cookie": return <LegalPage title="Cookie Policy" navigate={navigate} content={["What Are Cookies", "How We Use Cookies", "Types of Cookies", "Managing Cookies", "Third-Party Cookies", "Policy Updates"]} />;
      case "license": return <LegalPage title="License Agreement" navigate={navigate} content={["Grant of License", "Restrictions", "Intellectual Property", "Termination", "Disclaimer of Warranties", "Limitation of Liability"]} />;
      case "404": return <NotFoundPage navigate={navigate} />;
      case "maintenance": return <MaintenancePage navigate={navigate} />;
      default: return <DashboardPage navigate={navigate} />;
    }
  };

  const content = (
    <AnimatePresence mode="wait">
      <div key={screen}>{renderScreen()}</div>
    </AnimatePresence>
  );

  if (isPublic || isOnboard || isLegal || isUtility) {
    return (
      <div className="min-h-screen bg-[#07081a]">
        <ScreenFallback>{content}</ScreenFallback>
        {(isPublic || isUtility) && (
          <div className="fixed bottom-4 right-4 z-50">
            <div className="flex items-center gap-2 p-2 bg-[#0d0f2a]/90 backdrop-blur border border-white/[0.08] rounded-xl shadow-xl">
              <span className="text-xs text-slate-600 px-2">Demo nav:</span>
              <Btn variant="ghost" size="sm" onClick={() => navigate("dashboard")}>App</Btn>
              <Btn variant="ghost" size="sm" onClick={() => navigate("onboard")}>Onboard</Btn>
              <Btn variant="ghost" size="sm" onClick={() => navigate("404")}>404</Btn>
              <Btn variant="ghost" size="sm" onClick={() => navigate("maintenance")}>Maintenance</Btn>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <AppLayout current={screen} navigate={navigate}>
      <ScreenFallback>{content}</ScreenFallback>
      <div className="fixed bottom-4 right-4 z-50">
        <details className="group">
          <summary className="list-none cursor-pointer">
            <div className="p-2.5 bg-[#0d0f2a]/90 backdrop-blur border border-violet-500/20 rounded-xl shadow-xl text-xs text-violet-400 font-semibold hover:border-violet-500/40 transition-colors flex items-center gap-1.5">
              <Grid size={12} /> All Screens
            </div>
          </summary>
          <div className="absolute bottom-full right-0 mb-2 w-72 p-3 bg-[#0d0f2a]/95 backdrop-blur border border-white/[0.08] rounded-xl shadow-2xl max-h-80 overflow-y-auto">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-bold text-white">Navigate</span>
              <Btn variant="ghost" size="sm" onClick={() => navigate("landing")}>Landing</Btn>
            </div>
            <div className="grid grid-cols-2 gap-1">
              {APP_SCREENS.map((s) => (
                <button key={s} onClick={() => navigate(s)} className={`text-left px-2.5 py-1.5 rounded-lg text-xs transition-all ${screen === s ? "bg-violet-600/30 text-violet-300" : "text-slate-500 hover:text-white hover:bg-white/[0.05]"}`}>
                  {LABEL_MAP[s] ?? s}
                </button>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t border-white/[0.06] grid grid-cols-2 gap-1">
              {(["terms", "privacy", "cookie", "404", "maintenance"] as Screen[]).map((s) => (
                <button key={s} onClick={() => navigate(s)} className="text-left px-2.5 py-1.5 rounded-lg text-xs text-slate-600 hover:text-white hover:bg-white/[0.05] transition-all capitalize">{s}</button>
              ))}
            </div>
          </div>
        </details>
      </div>
    </AppLayout>
  );
}
