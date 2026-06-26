"use client";
import { useNavigate } from "@/lib/navigation";
import MaintenancePage from "@/app/screens/MaintenancePage";
export default function Page() {
  const navigate = useNavigate();
  return <MaintenancePage navigate={navigate} />;
}