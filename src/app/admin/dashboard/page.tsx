"use client";

import { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  Clock3,
  PlaneTakeoff,
  Loader2,
  History,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { ApiResponse, Attendance, Employee, LeaveRequest } from "@/lib/types";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";

export default function AdminDashboard() {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [todayAttendance, setTodayAttendance] = useState<Attendance[]>([]);
  const [pendingLeave, setPendingLeave] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const today = new Date().toISOString().slice(0, 10);

        const [empRes, attRes, leaveRes] = await Promise.all([
          apiFetch<ApiResponse<Employee[]>>("/employees?limit=1"),
          apiFetch<ApiResponse<Attendance[]>>(
            `/attendance/report?startDate=${today}&endDate=${today}`,
          ),
          apiFetch<ApiResponse<LeaveRequest[]>>(
            "/leave/all?status=PENDING&limit=1",
          ),
        ]);

        setTotalEmployees(empRes.pagination?.total ?? 0);
        setTodayAttendance(attRes.data ?? []);
        setPendingLeave(leaveRes.pagination?.total ?? 0);
      } catch (err) {
        // Prevent application breaking
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const present = todayAttendance.filter((a) => a.status === "PRESENT").length;
  const late = todayAttendance.filter((a) => a.status === "LATE").length;

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
          <Loader2 size={16} className="animate-spin text-emerald-600" />
          <span>Synchronizing operational overview metrics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-1 py-4 space-y-6 antialiased selection:bg-emerald-600 selection:text-white bg-neutral-50 dark:bg-neutral-950">
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
          System Overview
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
          Monitor operational workforce distribution, capture real-time
          timecards, and supervise pipeline exceptions.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total active roster"
          value={totalEmployees}
          icon={Users}
          tone="brand"
        />
        <StatCard
          label="Present logs today"
          value={present}
          icon={UserCheck}
          tone="brand"
        />
        <StatCard
          label="Tardy records today"
          value={late}
          icon={Clock3}
          tone="warn"
        />
        <StatCard
          label="Pending leaves queue"
          value={pendingLeave}
          icon={PlaneTakeoff}
          tone="warn"
        />
      </div>

      {/* Main Table Card Frame */}
      <div className="w-full bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
        <div className="border-b border-neutral-100 dark:border-neutral-800 px-5 py-4 bg-white dark:bg-neutral-900">
          <h2 className="text-[11px] font-bold text-neutral-900 dark:text-neutral-50 uppercase tracking-wider">
            Today&apos;s Active Attendance Roster
          </h2>
        </div>

        <div className="overflow-x-auto w-full bg-white dark:bg-neutral-900">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-950 text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider border-b border-neutral-200/60 dark:border-neutral-800/60">
                <th className="px-5 py-3 font-bold">Personnel Member</th>
                <th className="px-5 py-3 font-bold">Department Cluster</th>
                <th className="px-5 py-3 font-bold">Check-in Stamp</th>
                <th className="px-5 py-3 font-bold">Metrics Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs bg-white dark:bg-neutral-900">
              {todayAttendance.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-12 text-center text-neutral-400 dark:text-neutral-500 bg-white dark:bg-neutral-900"
                  >
                    <div className="flex flex-col items-center justify-center gap-1.5 max-w-xs mx-auto">
                      <History
                        size={18}
                        className="text-neutral-300 dark:text-neutral-700"
                      />
                      <span className="font-medium">
                        No workforce checkpoints logged today.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                todayAttendance.map((a) => (
                  <tr
                    key={a.id}
                    className="hover:bg-neutral-50/50 dark:hover:bg-neutral-950/40 transition-colors bg-white dark:bg-neutral-900"
                  >
                    <td className="px-5 py-3.5 font-bold text-neutral-900 dark:text-neutral-100">
                      {a.employee?.user
                        ? `${a.employee.user.firstName} ${a.employee.user.lastName}`
                        : "Unidentified Member"}
                    </td>
                    <td className="px-5 py-3.5 text-neutral-700 dark:text-neutral-300 font-semibold">
                      {a.employee?.department?.name ?? (
                        <span className="text-neutral-400 dark:text-neutral-600 font-normal">
                          Unassigned Slot
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-neutral-600 dark:text-neutral-400 font-mono tracking-tight font-medium">
                      {a.checkIn
                        ? new Date(a.checkIn).toLocaleTimeString(undefined, {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge status={a.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
