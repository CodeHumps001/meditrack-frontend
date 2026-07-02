const STYLES: Record<string, string> = {
  PRESENT: "bg-brand-50 text-brand-700",
  ACTIVE: "bg-brand-50 text-brand-700",
  APPROVED: "bg-brand-50 text-brand-700",
  COMPLETED: "bg-brand-50 text-brand-700",
  LATE: "bg-amber-50 text-warn",
  PENDING: "bg-amber-50 text-warn",
  HALF_DAY: "bg-amber-50 text-warn",
  ABSENT: "bg-red-50 text-danger",
  REJECTED: "bg-red-50 text-danger",
  TERMINATED: "bg-red-50 text-danger",
  FAILED: "bg-red-50 text-danger",
  INACTIVE: "bg-ink-900/5 text-ink-500",
  CANCELLED: "bg-ink-900/5 text-ink-500",
  LEAVE: "bg-blue-50 text-blue-700",
  ON_LEAVE: "bg-blue-50 text-blue-700",
  HOLIDAY: "bg-purple-50 text-purple-700",
  WEEKEND: "bg-ink-900/5 text-ink-500",
};

export function Badge({ status }: { status: string }) {
  const style = STYLES[status] || "bg-ink-900/5 text-ink-500";
  return (
    <span className={`badge ${style}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}
