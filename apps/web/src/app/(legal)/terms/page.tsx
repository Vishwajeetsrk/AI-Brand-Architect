"use client";
import { useNavigate } from "@/lib/navigation";
import LegalPage from "@/app/screens/LegalPage";
export default function Page() {
  const navigate = useNavigate();
  return <LegalPage title="Terms of Service" navigate={navigate} content={["Acceptance of Terms","Use License","Disclaimer","Limitations","Privacy Policy","Governing Law","Changes to Terms"]} />;
}