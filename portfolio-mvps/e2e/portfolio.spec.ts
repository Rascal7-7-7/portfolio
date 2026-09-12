import { expect, test } from "@playwright/test";
import { getProjectsWithCaseStudy, projects } from "../content/projects";

/**
 * 主要導線が壊れていないことを確認する。
 * 画面の見た目ではなく「閲覧者が作品に到達できるか」を検証対象にしている。
 */

test.describe("トップページ", () => {
  test("表示され、見出しが1つだけある", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("main")).toBeVisible();
  });

  test("作品カードがデータ件数ぶん表示される", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("article")).toHaveCount(projects.length);
  });

  test("各作品のデモとコードのリンクが、データどおりの先を向いている", async ({ page }) => {
    await page.goto("/");
    for (const project of projects) {
      if (project.links.demo) {
        await expect(
          page.locator(`a[href="${project.links.demo}"]`),
          `${project.slug} のデモリンク`,
        ).toHaveCount(1);
      }
      if (project.links.github) {
        await expect(
          page.locator(`a[href="${project.links.github}"]`),
          `${project.slug} のコードリンク`,
        ).toHaveCount(1);
      }
    }
  });

  test("外部リンクが新しいタブで開き、rel が設定されている", async ({ page }) => {
    await page.goto("/");
    const external = page.locator('a[target="_blank"]');
    const count = await external.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(external.nth(i)).toHaveAttribute("rel", /noopener/);
    }
  });

  test("セクション内アンカーの移動先が存在する", async ({ page }) => {
    await page.goto("/");
    const anchors = await page.locator('a[href^="#"]').evaluateAll((links) =>
      links.map((l) => (l as HTMLAnchorElement).getAttribute("href")),
    );
    for (const href of anchors) {
      if (!href || href === "#") continue;
      await expect(page.locator(href), `アンカー ${href} の移動先`).toHaveCount(1);
    }
  });
});

test.describe("アクセシビリティの回帰防止", () => {
  test("リンクのアクセシブルネームが一意である", async ({ page }) => {
    await page.goto("/");
    const pairs = await page.locator("a").evaluateAll((links) =>
      links.map((l) => ({
        name: (l.getAttribute("aria-label") || l.textContent || "").trim().replace(/\s+/g, " "),
        href: l.getAttribute("href"),
      })),
    );
    const byName = new Map<string, Set<string>>();
    for (const { name, href } of pairs) {
      if (!byName.has(name)) byName.set(name, new Set());
      byName.get(name)!.add(href ?? "");
    }
    const duplicated = Array.from(byName.entries()).filter(([, hrefs]) => hrefs.size > 1);
    expect(
      duplicated.map(([name]) => name),
      "同じ名前で異なる遷移先のリンクがある",
    ).toEqual([]);
  });

  test("装飾アイコンが支援技術に露出しない", async ({ page }) => {
    await page.goto("/");
    const exposed = await page
      .locator("svg:not([aria-hidden='true']):not([role])")
      .count();
    expect(exposed).toBe(0);
  });

  test("各セクションが名前を持つ", async ({ page }) => {
    await page.goto("/");
    const sections = page.locator("section");
    const total = await sections.count();
    for (let i = 0; i < total; i++) {
      await expect(sections.nth(i)).toHaveAttribute("aria-labelledby", /.+/);
    }
  });
});

test.describe("HTTP とメタデータ", () => {
  test("存在しないパスが 404 を返す", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.locator("h1")).toContainText("見つかりません");
  });

  test("robots.txt と sitemap.xml が配信される", async ({ request }) => {
    const robots = await request.get("/robots.txt");
    expect(robots.status()).toBe(200);
    expect(await robots.text()).toContain("Sitemap:");

    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    expect(await sitemap.text()).toContain("<urlset");
  });

  test("OG 画像と favicon が配信される", async ({ request }) => {
    expect((await request.get("/opengraph-image.png")).status()).toBe(200);
    expect((await request.get("/icon.svg")).status()).toBe(200);
  });
});

test.describe("作品詳細（Case Study）", () => {
  const withCaseStudy = getProjectsWithCaseStudy();

  test("Case Study のある作品にだけ詳細への導線がある", async ({ page }) => {
    await page.goto("/");
    for (const project of projects) {
      const link = page.locator(`a[href="/projects/${project.slug}"]`);
      await expect(link, `${project.slug} の詳細リンク`).toHaveCount(
        withCaseStudy.some((p) => p.slug === project.slug) ? 1 : 0,
      );
    }
  });

  for (const project of withCaseStudy) {
    test(`${project.slug} の詳細ページが表示される`, async ({ page }) => {
      const response = await page.goto(`/projects/${project.slug}`);
      expect(response?.status()).toBe(200);

      // 見出しは1つだけ、内容は作品の一言説明
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toContainText(project.headline);

      // 一覧へ戻れる
      await expect(page.locator('a[href="/#projects"]').first()).toBeVisible();
    });

    test(`${project.slug} の見出し階層が飛ばない`, async ({ page }) => {
      await page.goto(`/projects/${project.slug}`);
      const levels = await page
        .locator("h1,h2,h3")
        .evaluateAll((els) => els.map((e) => Number(e.tagName[1])));
      expect(levels[0]).toBe(1);
      for (let i = 1; i < levels.length; i++) {
        expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
      }
    });
  }

  test("Case Study の無い作品の詳細ページは 404 を返す", async ({ page }) => {
    const withoutCaseStudy = projects.filter(
      (p) => !withCaseStudy.some((w) => w.slug === p.slug),
    );
    expect(withoutCaseStudy.length).toBeGreaterThan(0);

    for (const project of withoutCaseStudy) {
      const response = await page.goto(`/projects/${project.slug}`);
      expect(response?.status(), `${project.slug}`).toBe(404);
    }
  });

  test("sitemap に詳細ページが含まれる", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    for (const project of withCaseStudy) {
      expect(xml, `${project.slug}`).toContain(`/projects/${project.slug}`);
    }
  });
});
