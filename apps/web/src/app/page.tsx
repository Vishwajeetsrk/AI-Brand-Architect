"use client";
import { useNavigate } from "@/lib/navigation";
import NotFoundPage from "@/app/screens/NotFoundPage";
export default function Page() {
  const navigate = useNavigate();
  return <NotFoundPage navigate={navigate} />;
}