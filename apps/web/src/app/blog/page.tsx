"use client";
import { useNavigate } from "@/lib/navigation";
import BlogPage from "@/app/screens/BlogPage";
export default function Page() {
  const navigate = useNavigate();
  return <BlogPage navigate={navigate} />;
}
