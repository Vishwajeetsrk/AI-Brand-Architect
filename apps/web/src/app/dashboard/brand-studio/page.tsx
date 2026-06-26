"use client";
import { useNavigate } from "@/lib/navigation";
import BrandStudioPage from "@/app/screens/BrandStudioPage";
export default function Page() {
  const navigate = useNavigate();
  return <BrandStudioPage navigate={navigate} />;
}