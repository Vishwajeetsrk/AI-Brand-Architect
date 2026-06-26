"use client";
import { useNavigate } from "@/lib/navigation";
import LegalPage from "@/app/screens/LegalPage";
export default function Page() {
  const navigate = useNavigate();
  return <LegalPage title="Privacy Policy" navigate={navigate} content={["Information We Collect","How We Use Information","Information Sharing","Data Security","Cookie Policy","Your Rights","Contact Us"]} />;
}