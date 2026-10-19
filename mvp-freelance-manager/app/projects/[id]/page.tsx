import type { Metadata } from "next";
import { ProjectDetailView } from "@/components/views/ProjectDetailView";

export const metadata: Metadata = { title: "案件詳細" };

export default async function ProjectDetailPage(props: PageProps<"/projects/[id]">) {
  const { id } = await props.params;
  return <ProjectDetailView id={id} />;
}
