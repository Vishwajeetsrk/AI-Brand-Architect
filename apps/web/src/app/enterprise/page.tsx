"use client";
import { useNavigate } from "@/lib/navigation";
import EnterprisePage from "@/app/screens/EnterprisePage";
export default function Page() {
  const navigate = useNavigate();
  return <EnterprisePage navigate={navigate} />;
}
