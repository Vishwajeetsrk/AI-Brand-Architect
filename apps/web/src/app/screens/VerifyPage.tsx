"use client";
import { CheckCircle } from "lucide-react";
import { Btn } from "../components/shared";
import AuthCard from "./AuthCard";
import type { Screen } from "../types";

export default function VerifyPage({ navigate }: { navigate: (s: Screen) => void }) {
  return (
    <AuthCard title="Verify Your Email" navigate={navigate}>
      <div className="text-center py-4">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600/20 to-blue-600/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={36} className="text-violet-400" />
        </div>
        <p className="text-slate-400 text-sm mb-2">We sent a verification link to</p>
        <p className="text-violet-300 font-semibold mb-6">alex@designstudio.com</p>
        <div className="text-xs text-slate-600 mb-6 space-y-1">
          <p>Check your email and click the link to verify your account.</p>
        </div>
        <Btn variant="primary" className="w-full justify-center mb-3" onClick={() => navigate("onboard")}>Continue to App</Btn>
        <button className="text-xs text-slate-500 hover:text-violet-400 transition-colors">Didn&apos;t receive the email? Check your spam or <span className="underline">try again</span></button>
      </div>
    </AuthCard>
  );
}
