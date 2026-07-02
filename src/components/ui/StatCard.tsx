import { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "default" | "brand" | "warn" | "danger";
}) {
  // Configured with reactive semantic utility boundaries for seamless light/dark execution
  const toneStyles = {
    default:
      "bg-neutral-100 dark:bg-zinc-800/60 text-neutral-600 dark:text-zinc-400",
    brand:
      "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400",
    warn: "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400",
    danger: "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400",
  }[tone];

  return (
    <div className="bg-neutral-50/60 dark:bg-zinc-900/40 border border-neutral-200 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm backdrop-blur-md flex items-start justify-between transition-colors duration-200">
      <div className="space-y-1.5">
        <span className="block text-[10px] font-bold tracking-widest text-neutral-400 dark:text-zinc-500 uppercase">
          {label}
        </span>
        <p className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white tabular-nums">
          {value}
        </p>
      </div>
      <div
        className={`rounded-xl p-2.5 transition-colors duration-200 ${toneStyles}`}
      >
        <Icon size={18} strokeWidth={2.5} />
      </div>
    </div>
  );
}
