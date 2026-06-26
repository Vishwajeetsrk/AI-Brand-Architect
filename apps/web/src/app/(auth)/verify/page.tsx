"use client";
import { useNavigate } from "@/lib/navigation";
import VerifyPage from "@/app/screens/VerifyPage";
export default function Page() {
  const navigate = useNavigate();
  return <VerifyPage navigate={navigate} />;
}