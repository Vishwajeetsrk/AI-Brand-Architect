"use client";
import { useNavigate } from "@/lib/navigation";
import LegalPage from "@/app/screens/LegalPage";
export default function Page() {
  const navigate = useNavigate();
  return <LegalPage title="License Agreement" navigate={navigate} content={["Grant of License","Restrictions","Intellectual Property","Termination","Disclaimer of Warranties","Limitation of Liability"]} />;
}