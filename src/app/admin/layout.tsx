"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  PlaneTakeoff,
  FileBarChart,
  DatabaseBackup,
  MapPin,
  Menu,
  X,
} from "lucide-react";
import { useAuth, isAdminRole } from "@/context/AuthContext";
import { Sidebar, NavItem } from "@/components/layout/Sidebar";

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Employees", href: "/admin/employees", icon: Users },
  { label: "Departments", href: "/admin/departments", icon: Building2 },
  {
    label: "Leave Requests",
    href: "/admin/leave-requests",
    icon: PlaneTakeoff,
  },
  { label: "Reports", href: "/admin/reports", icon: FileBarChart },
  { label: "Backups", href: "/admin/backups", icon: DatabaseBackup },
  { label: "Settings", href: "/admin/settings", icon: MapPin },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Structural Route Guarding System
  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
    } else if (!isAdminRole(user.role)) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  // Collapse the mobile menu tray explicitly when moving between pages
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Loading Framework Fallback Layout
  if (loading || !user || !isAdminRole(user.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-zinc-950">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-900 dark:border-zinc-800 dark:border-t-white" />
      </div>
    );
  }

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[16rem_1fr] bg-white dark:bg-zinc-950 antialiased transition-colors duration-200 overflow-hidden">
      {/* Desktop Persistent Sidebar Column */}
      <aside className="hidden md:block h-screen overflow-y-auto sticky top-0 border-r border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/20">
        <Sidebar items={NAV_ITEMS} />
      </aside>

      {/* Mobile Modal Drawer Overlay System */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${
          sidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop Veil */}
        <div
          className="absolute inset-0 bg-zinc-950/40 dark:bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />

        {/* Drawer Slide Element */}
        <div
          className={`absolute inset-y-0 left-0 w-64 bg-white dark:bg-zinc-900 shadow-2xl transition-transform duration-300 ease-in-out transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-end p-4 absolute right-2 top-2 z-50">
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Close menu"
            >
              <X size={16} />
            </button>
          </div>
          <Sidebar items={NAV_ITEMS} />
        </div>
      </div>

      {/* Primary Context Flex Viewport Shell */}
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Mobile Viewport Header Infrastructure */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 backdrop-blur-md px-6 md:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 active:scale-95 transition-all border border-zinc-100 dark:border-zinc-800"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
            <span className="font-bold text-xs uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
              Admin Portal
            </span>
          </div>

          <div className="h-8 w-8 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-600 dark:text-emerald-400 select-none border border-emerald-500/20">
            {user.firstName?.charAt(0) || "A"}
          </div>
        </header>

        {/* Core Scrolling Content Area */}
        <main className="flex-1 overflow-y-auto px-6 py-8 md:p-10 bg-zinc-50/30 dark:bg-zinc-950/10">
          <div className="w-full mx-auto max-w-5xl animate-in fade-in slide-in-from-bottom-2 duration-300">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
