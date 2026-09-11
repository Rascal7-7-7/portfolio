import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { projects } from "./index";
import type { Project } from "./types";

/**
 * 監査で見つかった最大の問題は、サイトに Prisma / OpenAI API / Stripe / Chart.js と
 * 書かれているのに、5作品すべての package.json に存在しなかったこと。
 * 人手のレビューでは再発するため、CI で落とす。
 */

/** 表示名 → 実際に必要な npm パッケージ */
const PACKAGE_FOR_STACK_LABEL: Record<string, string> = {
  "Next.js": "next",
  "Next.js (App Router)": "next",
  React: "react",
  TypeScript: "typescript",
  "Tailwind CSS": "tailwindcss",
  Prisma: "@prisma/client",
  "Drizzle ORM": "drizzle-orm",
  Stripe: "stripe",
  "Chart.js": "chart.js",
  Recharts: "recharts",
  "OpenAI API": "openai",
  "PostgreSQL": "pg",
  "Neon (PostgreSQL)": "@neondatabase/serverless",
};

/**
 * パッケージを伴わない表記の許可リスト。
 * フレームワークの機能名など、依存関係には現れないもの。
 * ここに無い表記を使いたい場合は、実装を確認したうえで追加すること。
 */
const LABELS_WITHOUT_PACKAGE = new Set([
  "Server Actions",
  "API Routes",
  "Server Components",
  "Route Handlers",
]);

function readDependencies(slug: string): Record<string, string> | null {
  // 作品の slug は、モノレポ内のディレクトリ名と一致させている
  const packageJsonPath = join(process.cwd(), "..", slug, "package.json");
  if (!existsSync(packageJsonPath)) return null;
  const pkg = JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
  return { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
}

describe("作品データの基本構造", () => {
  it("slug が一意である", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("必須フィールドが埋まっている", () => {
    for (const project of projects) {
      expect(project.slug, "slug").toMatch(/^[a-z0-9-]+$/);
      expect(project.name.length, `${project.slug}: name`).toBeGreaterThan(0);
      expect(project.headline.length, `${project.slug}: headline`).toBeGreaterThan(0);
      expect(project.summary.length, `${project.slug}: summary`).toBeGreaterThan(0);
      expect(project.stack.length, `${project.slug}: stack`).toBeGreaterThan(0);
      expect(project.categories.length, `${project.slug}: categories`).toBeGreaterThan(0);
    }
  });

  it("制作時期が YYYY-MM 形式である", () => {
    for (const project of projects) {
      expect(project.period.start, `${project.slug}`).toMatch(/^\d{4}-\d{2}$/);
      if (project.period.end) {
        expect(project.period.end, `${project.slug}`).toMatch(/^\d{4}-\d{2}$/);
      }
    }
  });

  it("チーム制作には担当範囲が書かれている", () => {
    for (const project of projects) {
      if (project.team.kind === "team") {
        expect(project.team.members, `${project.slug}: members`).toBeGreaterThan(1);
        expect(
          project.team.myRole.length,
          `${project.slug}: チーム制作なのに担当範囲が空`,
        ).toBeGreaterThan(0);
      }
    }
  });
});

describe("技術スタックが実装と一致している", () => {
  const withRepo = projects
    .map((project) => ({ project, deps: readDependencies(project.slug) }))
    .filter((entry): entry is { project: Project; deps: Record<string, string> } =>
      entry.deps !== null,
    );

  it("突き合わせ対象の作品が存在する", () => {
    expect(withRepo.length).toBeGreaterThan(0);
  });

  it.each(withRepo)("$project.slug の表記が package.json と矛盾しない", ({ project, deps }) => {
    for (const label of project.stack) {
      const required = PACKAGE_FOR_STACK_LABEL[label];
      if (required) {
        expect(
          deps[required],
          `${project.slug}: サイトに「${label}」と表示しているが、package.json に ${required} が無い`,
        ).toBeDefined();
        continue;
      }
      expect(
        LABELS_WITHOUT_PACKAGE.has(label),
        `${project.slug}: 「${label}」は対応する npm パッケージが未定義。` +
          `PACKAGE_FOR_STACK_LABEL か LABELS_WITHOUT_PACKAGE に、実装を確認したうえで追加すること`,
      ).toBe(true);
    }
  });

  it.each(withRepo)("$project.slug に未使用のライブラリ名が書かれていない", ({ project, deps }) => {
    // 過去に実際へ書かれていた虚偽表記。依存が無ければ書いてはいけない。
    const claimedButUnverified = ["Prisma", "Stripe", "Chart.js", "OpenAI API", "Recharts"];
    for (const label of claimedButUnverified) {
      if (!project.stack.includes(label)) continue;
      const required = PACKAGE_FOR_STACK_LABEL[label];
      expect(
        deps[required],
        `${project.slug}: 「${label}」と表示しているが実装に存在しない`,
      ).toBeDefined();
    }
  });
});

describe("検証できない表現が含まれていない", () => {
  it("根拠のない割合表記（-70% など）を使っていない", () => {
    const percentPattern = /[-−+]\s?\d+\s?[%％]/;
    for (const project of projects) {
      const texts = [
        project.headline,
        project.summary,
        ...project.highlights.map((h) => h.label),
      ];
      for (const text of texts) {
        expect(
          percentPattern.test(text),
          `${project.slug}: 検証できない割合表記が含まれている → "${text}"`,
        ).toBe(false);
      }
    }
  });
});

describe("リンク", () => {
  it("すべて https の絶対URLである", () => {
    for (const project of projects) {
      for (const [key, url] of Object.entries(project.links)) {
        if (!url) continue;
        expect(url, `${project.slug}: ${key}`).toMatch(/^https:\/\//);
      }
    }
  });

  it("公開デモとして扱う作品にはデモURLがある", () => {
    for (const project of projects) {
      if (project.verification === "live-demo") {
        expect(
          project.links.demo,
          `${project.slug}: verification が live-demo なのにデモURLが無い`,
        ).toBeTruthy();
      }
    }
  });
});
