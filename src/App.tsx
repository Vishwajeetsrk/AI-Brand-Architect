import { useState, lazy, Suspense } from "react";
import { AnimatePresence } from "motion/react";
import { Grid } from "lucide-react";
import { Screen, AppLayout, APP_SCREENS, LABEL_MAP, Card } from "./components/shared";

const Auth = lazy(() => import("./screens/auth"));
const Overview = lazy(() => import("./screens/overview"));
const Tools = lazy(() => import("./screens/tools"));
const Workspace = lazy(() => import("./screens/workspace"));
const BrandSettings = lazy(() => import("./screens/brand-settings"));

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
  const isOnboard = screen === "onboard";
  const isApp = APP_SCREENS.includes(screen);

  const renderScreen = () => {
    switch (screen) {
      case "landing": return <Auth.Landing nav={nav} />;
      case "signin": return <Auth.SignIn nav={nav} />;
      case "signup": return <Auth.SignUp nav={nav} />;
      case "forgot": return <Auth.Forgot nav={nav} />;
      case "verify": return <Auth.Verify nav={nav} />;
      case "onboard": return <Auth.Onboard nav={nav} />;
      case "dashboard": return <Overview.Dashboard nav={nav} />;
      case "command": return <Overview.CommandCenter nav={nav} />;
      case "mission": return <Overview.MissionControl nav={nav} />;
      case "project": return <Overview.Project nav={nav} />;
      case "playground": return <Tools.ModelPlayground />;
      case "image-gen": return <Tools.ImageGen />;
      case "voice": return <Tools.VoiceStudio />;
      case "chat": return <Tools.ChatScreen />;
      case "agents": return <Workspace.Agents nav={nav} />;
      case "tasks": return <Workspace.Tasks />;
      case "workflows": return <Workspace.Workflows nav={nav} />;
      case "mcp": return <Workspace.MCPTools />;
      case "cms": return <Workspace.CMS />;
      case "knowledge": return <Workspace.Knowledge />;
      case "templates": return <Workspace.Templates />;
      case "website-plan": return <Workspace.WebsitePlan />;
      case "brand-dna": return <BrandSettings.BrandDNA />;
      case "creative": return <BrandSettings.Creative />;
      case "analytics": return <BrandSettings.Analytics />;
      case "api-keys": return <BrandSettings.APIKeys />;
      case "team": return <BrandSettings.Team />;
      case "settings": return <BrandSettings.SettingsScreen />;
      default: return <Overview.Dashboard nav={nav} />;
    }
  };

  if (isPublic || isOnboard) {
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
