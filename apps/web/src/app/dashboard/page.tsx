"use client";
import { useNavigate } from "@/lib/navigation";
import DashboardPage from "@/app/screens/DashboardPage";
export default function Page() {
  const navigate = useNavigate();
  return <DashboardPage navigate={navigate} />;
}