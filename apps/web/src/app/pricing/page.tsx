"use client";
import { useNavigate } from "@/lib/navigation";
import PricingPage from "@/app/screens/PricingPage";
export default function Page() {
  const navigate = useNavigate();
  return <PricingPage navigate={navigate} />;
}
