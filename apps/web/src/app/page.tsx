"use client";
import { useNavigate } from "@/lib/navigation";
import LandingPage from "@/app/screens/LandingPage";
export default function Page() {
  const navigate = useNavigate();
  return <LandingPage navigate={navigate} />;
}
