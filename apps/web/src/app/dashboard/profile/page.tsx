"use client";
import { useNavigate } from "@/lib/navigation";
import ProfilePage from "@/app/screens/ProfilePage";
export default function Page() {
  const navigate = useNavigate();
  return <ProfilePage navigate={navigate} />;
}