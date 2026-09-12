import type { MetadataRoute } from "next";
import { getProjectsWithCaseStudy } from "@/content/projects";

const BASE_URL = "https://portfolio-mvps.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...getProjectsWithCaseStudy().map((project) => ({
      url: `${BASE_URL}/projects/${project.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
