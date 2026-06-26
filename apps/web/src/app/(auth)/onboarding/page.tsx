"use client";
import { useNavigate } from "@/lib/navigation";
import OnboardingPage from "@/app/screens/OnboardingPage";
export default function Page() {
  const navigate = useNavigate();
  return <OnboardingPage navigate={navigate} />;
}