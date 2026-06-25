import { useState, lazy, Suspense } from "react";
import { AnimatePresence } from "motion/react";
import { Grid } from "lucide-react";
import { Screen, AppLayout, APP_SCREENS, LABEL_MAP } from "./components/shared";

const Landing = lazy(() => import("./screens/auth").then(m => ({ default: m.Landing })));
const SignIn = lazy(() => import("./screens/auth").then(m => ({ default: m.SignIn })));
const SignUp = lazy(() => import("./screens/auth").then(m => ({ default: m.SignUp })));
const Forgot = lazy(() => import("./screens/auth").then(m => ({ default: m.Forgot })));
const Verify = lazy(() => import("./screens/auth").then(m => ({ default: m.Verify })));
const Onboard = lazy(() => import("./screens/auth").then(m => ({ default: m.Onboard })));

const Dashboard = lazy(() => import("./screens/overview").then(m => ({ default: m.Dashboard })));
const CommandCenter = lazy(() => import("./screens/overview").then(m => ({ default: m.CommandCenter })));
const MissionControl = lazy(() => import("./screens/overview").then(m => ({ default: m.MissionControl })));
const Project = lazy(() => import("./screens/overview").then(m => ({ default: m.Project })));

const ModelPlayground = lazy(() => import("./screens/tools").then(m => ({ default: m.ModelPlayground })));
const ImageGen = lazy(() => import("./screens/tools").then(m => ({ default: m.ImageGen })));
const VoiceStudio = lazy(() => import("./screens/tools").then(m => ({ default: m.VoiceStudio })));
const ChatScreen = lazy(() => import("./screens/tools").then(m => ({ default: m.ChatScreen })));

const Agents = lazy(() => import("./screens/workspace").then(m => ({ default: m.Agents })));
const Tasks = lazy(() => import("./screens/workspace").then(m => ({ default: m.Tasks })));
const Workflows = lazy(() => import("./screens/workspace").then(m => ({ default: m.Workflows })));
const MCPTools = lazy(() => import("./screens/workspace").then(m => ({ default: m.MCPTools })));
const CMS = lazy(() => import("./screens/workspace").then(m => ({ default: m.CMS })));
const Knowledge = lazy(() => import("./screens/workspace").then(m => ({ default: m.Knowledge })));
const Templates = lazy(() => import("./screens/workspace").then(m => ({ default: m.Templates })));
const WebsitePlan = lazy(() => import("./screens/workspace").then(m => ({ default: m.WebsitePlan })));

const BrandDNA = lazy(() => import("./screens/brand-settings").then(m => ({ default: m.BrandDNA })));
const Creative = lazy(() => import("./screens/brand-settings").then(m => ({ default: m.Creative })));
const Analytics = lazy(() => import("./screens/brand-settings").then(m => ({ default: m.Analytics })));
const APIKeys = lazy(() => import("./screens/brand-settings").then(m => ({ default: m.APIKeys })));
const Team = lazy(() => import("./screens/brand-settings").then(m => ({ default: m.Team })));
const SettingsScreen = lazy(() => import("./screens/brand-settings").then(m => ({ default: m.SettingsScreen })));

function Loading() {
  return (
    <div className="flex items-center justify-center h-full min-h-[200px]">
      <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const nav = (s: Screen) => setScreen(s);

  const isPublic = ["landing", "signin", "signup", "forgot", "verify"].includes(screen);

  const renderScreen = () => {
    switch (screen) {
      case "landing": return <Landing nav={nav} />;
      case "signin": return <SignIn nav={nav} />;
      case "signup": return <SignUp nav={nav} />;
      case "forgot": return <Forgot nav={nav} />;
      case "verify": return <Verify nav={nav} />;
      case "onboard": return <Onboard nav={nav} />;
      case "dashboard": return <Dashboard nav={nav} />;
      case "command": return <CommandCenter nav={nav} />;
      case "mission": return <MissionControl nav={nav} />;
      case "project": return <Project nav={nav} />;
      case "playground": return <ModelPlayground />;
      case "image-gen": return <ImageGen />;
      case "voice": return <VoiceStudio />;
      case "chat": return <ChatScreen />;
      case "agents": return <Agents nav={nav} />;
      case "tasks": return <Tasks />;
      case "workflows": return <Workflows nav={nav} />;
      case "mcp": return <MCPTools />;
      case "cms": return <CMS />;
      case "knowledge": return <Knowledge />;
      case "templates": return <Templates />;
      case "website-plan": return <WebsitePlan />;
      case "brand-dna": return <BrandDNA />;
      case "creative": return <Creative />;
      case "analytics": return <Analytics />;
      case "api-keys": return <APIKeys />;
      case "team": return <Team />;
      case "settings": return <SettingsScreen />;
      default: return <Dashboard nav={nav} />;
    }
  };

  if (isPublic || screen === "onboard") {
    return (
      <div className="min-h-screen bg-[#07091c]">
        <Suspense fallback={<Loading />}>
          <AnimatePresence mode="wait"><div key={screen}>{renderScreen()}</div></AnimatePresence>
        </Suspense>
        <div className="fixed bottom-4 right-4 z-50">
          <div className="flex items-center gap-1.5 p-1.5 bg-[#0c1022]/95 backdrop-blur border border-white/[0.07] rounded-xl shadow-xl">
            <span className="text-[9px] text-slate-700 px-1.5">Demo:</span>
            {([["signin","Sign In"],["signup","Sign Up"],["onboard","Onboard"],["dashboard","Dashboard"]] as [Screen,string][]).map(([s,l])=>(
              <button key={s} onClick={()=>nav(s)} className="px-2 py-1 rounded-md text-[10px] text-slate-500 hover:text-white hover:bg-white/[0.06] transition-all">{l}</button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <AppLayout cur={screen} nav={nav}>
      <Suspense fallback={<Loading />}>
        <AnimatePresence mode="wait"><div key={screen}>{renderScreen()}</div></AnimatePresence>
      </Suspense>
      <div className="fixed bottom-4 right-4 z-50">
        <details className="group">
          <summary className="list-none cursor-pointer">
            <div className="p-2 bg-[#0c1022]/95 backdrop-blur border border-violet-500/20 rounded-xl shadow-xl text-[10px] text-violet-400 font-bold hover:border-violet-500/40 transition-colors flex items-center gap-1.5">
              <Grid size={11}/>All Screens ({APP_SCREENS.length+6})
            </div>
          </summary>
          <div className="absolute bottom-full right-0 mb-2 w-72 p-3 bg-[#0c1022]/98 backdrop-blur border border-white/[0.07] rounded-xl shadow-2xl max-h-80 overflow-y-auto">
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2 px-1">Public</p>
            <div className="grid grid-cols-3 gap-1 mb-2">
              {(["landing","signin","signup","forgot","verify","onboard"] as Screen[]).map(s=>(
                <button key={s} onClick={()=>nav(s)} className="text-left px-2 py-1 rounded-md text-[10px] text-slate-600 hover:text-white hover:bg-white/[0.05] transition-all capitalize">{s}</button>
              ))}
            </div>
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2 px-1 pt-1 border-t border-white/[0.05]">App Screens</p>
            <div className="grid grid-cols-2 gap-1">
              {APP_SCREENS.map(s=>(
                <button key={s} onClick={()=>nav(s)} className={`text-left px-2 py-1.5 rounded-md text-[10px] transition-all ${screen===s?"bg-violet-600/25 text-violet-300":"text-slate-500 hover:text-white hover:bg-white/[0.05]"}`}>{LABEL_MAP[s]??s}</button>
              ))}
            </div>
          </div>
        </details>
      </div>
    </AppLayout>
  );
}
