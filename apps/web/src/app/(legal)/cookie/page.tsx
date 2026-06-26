"use client";
import { useNavigate } from "@/lib/navigation";
import LegalPage from "@/app/screens/LegalPage";
export default function Page() {
  const navigate = useNavigate();
  return <LegalPage title="Cookie Policy" navigate={navigate} content={["What Are Cookies","How We Use Cookies","Types of Cookies","Managing Cookies","Third-Party Cookies","Policy Updates"]} />;
}