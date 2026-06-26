"use client";
import { useNavigate } from "@/lib/navigation";
import MissionControlPage from "@/app/screens/MissionControlPage";
export default function Page() {
  const navigate = useNavigate();
  return <MissionControlPage navigate={navigate} />;
}