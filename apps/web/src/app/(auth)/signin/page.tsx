"use client";
import { useNavigate } from "@/lib/navigation";
import SignInPage from "@/app/screens/SignInPage";
export default function Page() {
  const navigate = useNavigate();
  return <SignInPage navigate={navigate} />;
}