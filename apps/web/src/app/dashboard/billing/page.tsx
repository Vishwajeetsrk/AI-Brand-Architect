"use client";
import { useNavigate } from "@/lib/navigation";
import BillingPage from "@/app/screens/BillingPage";
export default function Page() {
  const navigate = useNavigate();
  return <BillingPage navigate={navigate} />;
}