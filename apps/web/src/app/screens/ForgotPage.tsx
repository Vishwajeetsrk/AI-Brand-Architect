"use client";
import { useState } from "react";
import { AtSign, Send, ChevronLeft, CheckCircle } from "lucide-react";
import { Btn, Input } from "../components/shared";
import AuthCard from "./AuthCard";
import type { Screen } from "../types";

export default function ForgotPage({ navigate }: { navigate: (s: Screen) => void }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <AuthCard title="Reset Your Password" subtitle="Enter your email and we'll send you a reset link." navigate={navigate}>
      {!sent ? (
        <>
          <div className="mb-4">
            <label className="text-xs text-slate-400 mb-1.5 block">Email address</label>
            <Input placeholder="alex@example.com" value={email} onChange={setEmail} icon={AtSign} />
          </div>
          <Btn variant="primary" className="w-full justify-center" size="lg" icon={Send} onClick={() => setSent(true)}>Send Reset Link</Btn>
          <button onClick={() => navigate("signin")} className="w-full text-center text-xs text-slate-500 hover:text-slate-300 mt-4 flex items-center justify-center gap-1">
            <ChevronLeft size={12} /> Back to Sign In
          </button>
        </>
      ) : (
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={28} className="text-emerald-400" />
          </div>
          <h3 className="font-bold text-white mb-2">Check your email</h3>
          <p className="text-sm text-slate-500 mb-6">We sent a password reset link to <span className="text-violet-400">{email || "your email"}</span>.</p>
          <Btn variant="primary" onClick={() => navigate("verify")} className="mx-auto">Check Email</Btn>
        </div>
      )}
    </AuthCard>
  );
}
