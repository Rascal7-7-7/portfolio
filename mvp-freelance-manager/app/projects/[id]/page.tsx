import { ProjectDetailView } from "@/components/views/ProjectDetailView";

export default async function ProjectDetailPage(props: PageProps<"/projects/[id]">) {
  const { id } = await props.params;
  return <ProjectDetailView id={id} />;
}
