"use client";
import { useState } from "react";
import { AtSign, Lock, Eye, EyeOff } from "lucide-react";
import { Btn, Input } from "../components/shared";
import { BrandIcon } from "../components/ui/brand-icon";
import AuthCard from "./AuthCard";
import type { Screen } from "../types";

export default function SignInPage({ navigate }: { navigate: (s: Screen) => void }) {
  const [email, setEmail] = useState("alex@designstudio.com");
  const [pass, setPass] = useState("••••••••••");
  const [showPass, setShowPass] = useState(false);
  const socials = [
    { name: "Continue with Google", brand: "Google", color: "from-red-500/20 to-orange-500/10" },
    { name: "Continue with GitHub", brand: "GitHub", color: "from-slate-600/20 to-slate-500/10" },
    { name: "Continue with Apple", brand: "Apple", color: "from-white/5 to-white/0" },
  ];
  return (
    <AuthCard title="Welcome Back" subtitle="Join thousands of creators today." navigate={navigate}>
      <div className="space-y-3 mb-5">
        {socials.map((s) => (
          <button key={s.name} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-white/[0.07] bg-gradient-to-r ${s.color} text-sm text-slate-300 hover:border-violet-500/30 transition-all`}>
            <BrandIcon name={s.brand} size={16} /> {s.name}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-white/[0.06]" />
        <span className="text-xs text-slate-600">or</span>
        <div className="flex-1 h-px bg-white/[0.06]" />
      </div>
      <div className="space-y-3">
        <div>
          <label className="text-xs text-slate-400 mb-1.5 block">Email address</label>
          <Input placeholder="you@example.com" value={email} onChange={setEmail} icon={AtSign} />
        </div>
        <div>
          <div className="flex justify-between mb-1.5">
            <label className="text-xs text-slate-400">Password</label>
            <button onClick={() => navigate("forgot")} className="text-xs text-violet-400 hover:text-violet-300">Forgot password?</button>
          </div>
          <div className="relative">
            <Input placeholder="••••••••" type={showPass ? "text" : "password"} value={pass} onChange={setPass} icon={Lock} />
            <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
              {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>
        <Btn variant="primary" className="w-full justify-center mt-2" size="lg" onClick={() => navigate("onboard")}>Sign In</Btn>
      </div>
      <p className="text-center text-xs text-slate-600 mt-5">
        Don&apos;t have an account?{" "}
        <button onClick={() => navigate("signup")} className="text-violet-400 hover:text-violet-300 font-semibold">Sign up</button>
      </p>
    </AuthCard>
  );
}
