"use client";
import { useNavigate } from "@/lib/navigation";
import HelpPage from "@/app/screens/HelpPage";
export default function Page() {
  const navigate = useNavigate();
  return <HelpPage navigate={navigate} />;
}