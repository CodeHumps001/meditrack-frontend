"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarClock,
  PlaneTakeoff,
  UserCircle,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Sidebar, NavItem } from "@/components/layout/Sidebar";

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/employee/dashboard", icon: LayoutDashboard },
  { label: "Attendance", href: "/employee/attendance", icon: CalendarClock },
  { label: "Leave", href: "/employee/leave", icon: PlaneTakeoff },
  { label: "Profile", href: "/employee/profile", icon: UserCircle },
];

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-zinc-950">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-200 border-t-emerald-600 dark:border-zinc-800 dark:border-t-white" />
      </div>
    );
  }
  return (
    <div className="grid h-screen w-screen grid-cols-1 md:grid-cols-[16rem_1fr] bg-white dark:bg-zinc-950 antialiased transition-colors duration-200 overflow-hidden">
      {/* Sidebar Desktop Navigation Anchor (Always Locked on Desktop) */}
      <aside className="hidden md:block h-screen shrink-0 border-r border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/20">
        <Sidebar items={NAV_ITEMS} />
      </aside>

      {/* Main Content Area Container — Padding-bottom added on mobile to prevent navbar from blocking content */}
      <div className="flex flex-col h-screen overflow-hidden min-w-0 pb-16 md:pb-0">
        {/* Mobile Viewport Header Infrastructure */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 backdrop-blur-md px-6 md:hidden">
          <span className="font-bold text-xs uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
            Workspace
          </span>

          <div className="flex items-center gap-3">
            {/* Native Mobile Logout Button Trigger */}
            <button
              onClick={logout}
              className="p-2 rounded-xl text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all active:scale-95 border border-zinc-100 dark:border-zinc-800"
              aria-label="Sign out"
            >
              <LogOut size={16} />
            </button>
            <div className="h-8 w-8 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-600 dark:text-emerald-400 select-none border border-emerald-500/20">
              {user.firstName?.charAt(0) || "E"}
            </div>
          </div>
        </header>

        {/* Content View Canvas Area */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:p-10 bg-zinc-50/30 dark:bg-zinc-950/10">
          <div className="w-full mx-auto max-w-5xl animate-in fade-in slide-in-from-bottom-2 duration-300">
            {children}
          </div>
        </main>

        {/* MOBILE BOTTOM NAVIGATION BAR: Replaces sliding drawer entirely */}
        <nav className="fixed bottom-0 left-0 right-0 h-16 border-t border-zinc-100 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-lg grid grid-cols-4 items-center justify-items-center px-4 md:hidden z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all ${
                  isActive
                    ? "text-emerald-600 dark:text-emerald-400 font-bold"
                    : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] tracking-tight font-medium">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
