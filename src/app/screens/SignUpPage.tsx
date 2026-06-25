import { useState } from "react";
import { User, AtSign, Lock } from "lucide-react";
import { Btn, Input } from "../components/shared";
import { BrandIcon } from "../components/ui/brand-icon";
import AuthCard from "./AuthCard";
import type { Screen } from "../types";

export default function SignUpPage({ navigate }: { navigate: (s: Screen) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const socials = [
    { name: "Continue with Google", brand: "Google", color: "from-red-500/20 to-orange-500/10" },
    { name: "Continue with GitHub", brand: "GitHub", color: "from-slate-600/20 to-slate-500/10" },
    { name: "Continue with Apple", brand: "Apple", color: "from-white/5 to-white/0" },
  ];
  return (
    <AuthCard title="Create Your Account" subtitle="Join thousands of creators today." navigate={navigate}>
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
      <div className="space-y-3 mb-5">
        {[
          { label: "Full Name", placeholder: "Alex Johnson", value: name, onChange: setName, icon: User },
          { label: "Email address", placeholder: "alex@example.com", value: email, onChange: setEmail, icon: AtSign },
          { label: "Password", placeholder: "Create a strong password", value: pass, onChange: setPass, icon: Lock, type: "password" },
        ].map((f) => (
          <div key={f.label}>
            <label className="text-xs text-slate-400 mb-1.5 block">{f.label}</label>
            <Input placeholder={f.placeholder} value={f.value} onChange={f.onChange} icon={f.icon} type={f.type} />
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-600 mb-4">
        By creating an account, you agree to our{" "}
        <button onClick={() => navigate("terms")} className="text-violet-400">Terms of Service</button> and{" "}
        <button onClick={() => navigate("privacy")} className="text-violet-400">Privacy Policy</button>.
      </p>
      <Btn variant="primary" className="w-full justify-center" size="lg" onClick={() => navigate("verify")}>Create Account</Btn>
      <p className="text-center text-xs text-slate-600 mt-5">
        Already have an account?{" "}
        <button onClick={() => navigate("signin")} className="text-violet-400 font-semibold">Sign in</button>
      </p>
    </AuthCard>
  );
}
