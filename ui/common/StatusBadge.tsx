import { statusClassName,toDisplayStatus } from "@/lib/format";

export function StatusBadge({ status }: { status: string | undefined }) {
  const label = toDisplayStatus(status);

  return (
    <span
      className={`status-chip ${statusClassName(status)}`}
      role="status"
      aria-label={`Status: ${label}`}
    >
      {label}
    </span>
  );
}
