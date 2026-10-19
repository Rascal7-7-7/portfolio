import { Pill } from "@/components/ui";
import {
  type InvoiceStatus,
  type ProjectStatus,
  INVOICE_STATUS_LABEL,
  INVOICE_STATUS_STYLE,
  PROJECT_STATUS_LABEL,
  PROJECT_STATUS_STYLE,
} from "@/types";

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  return <Pill className={PROJECT_STATUS_STYLE[status]}>{PROJECT_STATUS_LABEL[status]}</Pill>;
}

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  return <Pill className={INVOICE_STATUS_STYLE[status]}>{INVOICE_STATUS_LABEL[status]}</Pill>;
}
