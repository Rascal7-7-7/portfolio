import type { Metadata } from "next";
import { ProjectsView } from "@/components/views/ProjectsView";

export const metadata: Metadata = { title: "案件" };

export default function ProjectsPage() {
  return <ProjectsView />;
}
