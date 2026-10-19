import type { Metadata } from "next";
import { NewProjectView } from "@/components/views/NewProjectView";

export const metadata: Metadata = { title: "案件を登録" };

export default function NewProjectPage() {
  return <NewProjectView />;
}
