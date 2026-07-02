"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarClock,
  PlaneTakeoff,
  UserCircle,
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
  const { user, loading } = useAuth();
  const router = useRouter();

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
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[16rem_1fr] bg-white dark:bg-zinc-950 antialiased transition-colors duration-200 overflow-hidden">
      {/* Sidebar Desktop Navigation Anchor */}
      <aside className="hidden md:block h-screen overflow-y-auto sticky top-0 border-r border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/20">
        <Sidebar items={NAV_ITEMS} />
      </aside>

      {/* Main Framework Layout Container */}
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Mobile App Navigation Header Block */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 backdrop-blur-md px-6 md:hidden">
          <span className="font-bold text-xs uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
            Employee Workspace
          </span>
          <div className="h-8 w-8 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-600 dark:text-emerald-400 select-none border border-emerald-500/20">
            {user.firstName?.charAt(0) || "E"}
          </div>
        </header>

        {/* Content View Canvas Area */}
        <main className="flex-1 overflow-y-auto px-6 py-8 md:p-10 bg-zinc-50/30 dark:bg-zinc-950/10">
          <div className="w-full mx-auto max-w-5xl animate-in fade-in slide-in-from-bottom-2 duration-300">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
