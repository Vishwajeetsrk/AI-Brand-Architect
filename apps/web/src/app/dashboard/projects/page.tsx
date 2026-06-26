"use client";
import { useNavigate } from "@/lib/navigation";
import ProjectsPage from "@/app/screens/ProjectsPage";
export default function Page() {
  const navigate = useNavigate();
  return <ProjectsPage navigate={navigate} />;
}