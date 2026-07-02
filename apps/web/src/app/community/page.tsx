"use client";
import { useNavigate } from "@/lib/navigation";
import CommunityPage from "@/app/screens/CommunityPage";
export default function Page() {
  const navigate = useNavigate();
  return <CommunityPage navigate={navigate} />;
}
