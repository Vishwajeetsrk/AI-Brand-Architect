"use client";
import { useNavigate } from "@/lib/navigation";
import ForgotPage from "@/app/screens/ForgotPage";
export default function Page() {
  const navigate = useNavigate();
  return <ForgotPage navigate={navigate} />;
}