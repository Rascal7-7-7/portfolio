"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { actions, useAppStore } from "@/lib/store";
import { addDays } from "@/lib/dates";
import { DateInput } from "@/components/DateInput";
import { buttonStyles, Page, PageHeader, PageSkeleton } from "@/components/ui";
import { PROJECT_STATUS_LABEL, PROJECT_STATUSES, type ProjectStatus } from "@/types";

const MAX_TEXT = 60;

export function NewProjectView() {
  const store = useAppStore();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<string | null>(null);
  if (!store) return <PageSkeleton />;
  const { today } = store;

  function submit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const client = String(form.get("client") ?? "").trim();
    const amount = Number(form.get("amount"));
    const dueDate = String(form.get("dueDate") ?? "");
    const status = String(form.get("status")) as ProjectStatus;

    if (!name || !client) return setError("案件名と取引先は必須です");
    if (!Number.isInteger(amount) || amount < 0) return setError("金額は0以上の整数で入力してください");
    if (!dueDate) return setError("納期を入力してください");
    if (!PROJECT_STATUSES.includes(status)) return setError("ステータスを選んでください");

    const id = actions.addProject({
      name: name.slice(0, MAX_TEXT),
      client: client.slice(0, MAX_TEXT),
      amount,
      status,
      dueDate,
    });
    router.push(`/projects/${id}`);
  }

  const field = "block text-xs font-medium text-warm-900";

  return (
    <Page>
      <Link href="/projects" className="hit mb-4 inline-flex items-center gap-1 text-xs text-warm-500 hover:text-ink">
        <ArrowLeft size={14} aria-hidden />
        案件一覧
      </Link>
      <PageHeader title="案件を登録" description="登録するとタスクと請求書をこの案件に紐づけられます。" />

      <form onSubmit={submit} noValidate className="grid max-w-3xl gap-4 rounded-lg border border-line bg-canvas p-5 sm:grid-cols-2">
        <label className={`${field} sm:col-span-2`}>
          案件名 <span className="font-normal">（必須）</span>
          <input name="name" required maxLength={MAX_TEXT} placeholder="例：サービスサイト制作" className={`${buttonStyles.input} mt-1`} />
        </label>
        <label className={`${field} sm:col-span-2`}>
          取引先 <span className="font-normal">（必須）</span>
          <input name="client" required maxLength={MAX_TEXT} placeholder="例：株式会社ひなた企画" className={`${buttonStyles.input} mt-1`} />
        </label>
        <label className={field}>
          受注額（円）
          <input name="amount" type="number" inputMode="numeric" min={0} step={10000} defaultValue={300000} className={`${buttonStyles.input} num mt-1`} />
        </label>
        <label className={field}>
          納期
          <DateInput name="dueDate" value={dueDate ?? addDays(today, 30)} onChange={setDueDate} className="mt-1" />
        </label>
        <label className={field}>
          ステータス
          <select name="status" defaultValue="estimate" className={`${buttonStyles.input} mt-1`}>
            {PROJECT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {PROJECT_STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </label>
        {error && (
          <p role="alert" className="text-xs font-semibold text-orange sm:col-span-2">
            {error}
          </p>
        )}
        <div className="flex gap-2 sm:col-span-2">
          <button type="submit" className={buttonStyles.primary}>
            登録する
          </button>
          <Link href="/projects" className={buttonStyles.secondary}>
            キャンセル
          </Link>
        </div>
      </form>
    </Page>
  );
}
