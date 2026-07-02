"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon, LogOut, Activity } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export function Sidebar({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const userFullName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
    : "Staff Member";
  const userEmail = user?.email || "employee@meditrack.com";
  const userInitial =
    user?.firstName?.charAt(0) || user?.lastName?.charAt(0) || "M";

  return (
    <aside className="flex h-screen w-full flex-col bg-white dark:bg-neutral-900 border-r border-neutral-200/80 dark:border-neutral-800/60 transition-colors duration-200 overflow-hidden">
      {/* Brand Header Identity */}
      <div className="flex h-16 shrink-0 items-center gap-2.5 px-6 border-b border-neutral-100 dark:border-neutral-800/80 bg-white dark:bg-neutral-900">
        <div className="h-8 w-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-sm shadow-emerald-100 dark:shadow-none shrink-0">
          <Activity size={16} strokeWidth={2.5} className="animate-pulse" />
        </div>
        <div className="min-w-0">
          <span className="font-bold tracking-tight text-sm text-neutral-900 dark:text-neutral-50 block truncate">
            MediTrack
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block -mt-1 font-medium tracking-wide">
            Hospital Portal
          </span>
        </div>
      </div>

      {/* Navigation Layer - Takes remaining space and scrolls smoothly internally */}
      <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto min-h-0">
        {items.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-[0.99] group ${
                active
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-extrabold"
                  : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-neutral-100"
              }`}
            >
              <Icon
                size={15}
                strokeWidth={active ? 2.5 : 2}
                className={`shrink-0 ${
                  active
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-600 dark:group-hover:text-neutral-300"
                }`}
              />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footnote Identity Profiler & Action Shell - Locked to the bottom using shrink-0 */}
      <div className="shrink-0 border-t border-neutral-100 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 p-4 space-y-3 mt-auto">
        {/* Flat Profile Information Card Grid */}
        <div className="flex items-center gap-3 rounded-xl border border-neutral-200/80 dark:border-neutral-800 p-3 bg-neutral-50/50 dark:bg-neutral-950/40">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-bold text-xs text-neutral-800 dark:text-neutral-200 uppercase select-none">
            {userInitial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold tracking-tight text-neutral-900 dark:text-neutral-100 truncate">
              {userFullName}
            </p>
            <p className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 truncate mt-0.5">
              {userEmail}
            </p>
          </div>
        </div>

        {/* Minimalist Action Sign Out Trigger */}
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 hover:bg-red-50/60 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-150 active:scale-[0.99] group"
        >
          <LogOut
            size={15}
            strokeWidth={2}
            className="text-neutral-400 dark:text-neutral-500 group-hover:text-current shrink-0 transition-colors"
          />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
