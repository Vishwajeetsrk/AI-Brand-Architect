"use client";
import { useNavigate } from "@/lib/navigation";
import SignUpPage from "@/app/screens/SignUpPage";
export default function Page() {
  const navigate = useNavigate();
  return <SignUpPage navigate={navigate} />;
}