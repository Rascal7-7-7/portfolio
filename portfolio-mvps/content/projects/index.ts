import type { Category, Project, Tier } from "./types";
import { mvpLpGenerator } from "./mvp-lp-generator";
import { mvpBookingSystem } from "./mvp-booking-system";
import { mvpEstimateManager } from "./mvp-estimate-manager";
import { mvpSubscriptionEc } from "./mvp-subscription-ec";
import { mvpFreelanceManager } from "./mvp-freelance-manager";

/**
 * 掲載順。ここの並びがそのまま一覧の表示順になる。
 * 作品を追加するときは、ファイルを1つ作ってこの配列に足すだけでよい。
 */
export const projects: readonly Project[] = [
  mvpLpGenerator,
  mvpBookingSystem,
  mvpEstimateManager,
  mvpSubscriptionEc,
  mvpFreelanceManager,
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getProjectsByTier(tier: Tier): readonly Project[] {
  return projects.filter((project) => project.tier === tier);
}

export function getProjectsByCategory(category: Category): readonly Project[] {
  return projects.filter((project) => project.categories.includes(category));
}

/** 実際に使われている領域だけを返す。空の領域を一覧に出さないため。 */
export function getUsedCategories(): readonly Category[] {
  const used = new Set<Category>();
  for (const project of projects) {
    for (const category of project.categories) {
      used.add(category);
    }
  }
  return Array.from(used);
}

export type {
  Category,
  Challenge,
  Decision,
  Highlight,
  Period,
  Project,
  ProjectLinks,
  Screenshot,
  Team,
  Tier,
  Verification,
} from "./types";
