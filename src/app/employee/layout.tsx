"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarClock,
  PlaneTakeoff,
  UserCircle,
  Menu,
  X,
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
  // FIXED: Added local state variable to toggle mobile sidebar sheet overlays
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  // FIXED: Automatically close the mobile sheet drawer on router path change events
  useEffect(() => {
    setSidebarOpen(false);
  }, [router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-zinc-950">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-200 border-t-emerald-600 dark:border-zinc-800 dark:border-t-white" />
      </div>
    );
  }
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[16rem_1fr] bg-white dark:bg-zinc-950 antialiased transition-colors duration-200 overflow-hidden">
      {/* Sidebar Desktop Navigation Anchor (Always Locked on Desktop) */}
      <aside className="hidden md:block h-screen overflow-y-auto sticky top-0 border-r border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/20">
        <Sidebar items={NAV_ITEMS} />
      </aside>

      {/* FIXED: Mobile Dynamic Sidebar sliding tray drawer sheet overlay */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-200 ${
          sidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Clickable dark backdrop layer curtain matrix */}
        <div
          className="absolute inset-0 bg-zinc-950/20 dark:bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
        <div
          className={`absolute inset-y-0 left-0 w-64 bg-white dark:bg-zinc-900 shadow-xl border-r border-zinc-100 dark:border-zinc-800 transition-transform duration-300 ease-in-out transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Close sliding window drawer handle option */}
          <div className="flex justify-end p-4 absolute right-2 top-2 z-50">
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          <Sidebar items={NAV_ITEMS} />
        </div>
      </div>

      {/* Main Framework Layout Container */}
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Mobile App Navigation Header Block */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 backdrop-blur-md px-6 md:hidden">
          {/* FIXED: Added a premium hamburger Menu button toggle handler */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-1.5 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 active:scale-95 transition-all"
            >
              <Menu size={20} />
            </button>
            <span className="font-bold text-xs uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
              Workspace
            </span>
          </div>
          <div className="h-8 w-8 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-600 dark:text-emerald-400 select-none border border-emerald-500/20">
            {user.firstName?.charAt(0) || "E"}
          </div>
        </header>

        {/* Content View Canvas Area */}
        <main className="flex-1 overflow-y-auto px-3 py-4 md:p-10 bg-zinc-50/30 dark:bg-zinc-950/10">
          <div className="w-full mx-auto max-w-5xl animate-in fade-in slide-in-from-bottom-2 duration-300">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
