"use client";

import { useEstimates } from "@/lib/store";
import { estimateNumber } from "@/lib/utils";
import EstimateForm from "@/components/estimate-form/EstimateForm";
import LoadingState from "@/components/LoadingState";
import NotFoundState from "@/components/NotFoundState";

export default function EditEstimate({ id }: { id: number }) {
  const { estimates } = useEstimates();
  if (!estimates) return <LoadingState />;
  const estimate = estimates.find((e) => e.id === id);
  if (!estimate) return <NotFoundState />;

  return (
    <div className="mx-auto max-w-6xl space-y-5 p-4 sm:p-8">
      <h1 className="text-2xl font-semibold tracking-tight text-navy">
        見積を編集 <span className="tnum text-base font-normal text-muted">{estimateNumber(id)}</span>
      </h1>
      <EstimateForm initial={estimate} />
    </div>
  );
}
