"use client";

import { useEffect, useState } from "react";
import { CalendarCheck, TrendingUp, Clock3, AlertCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Attendance, AttendanceStats, ApiResponse } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";

export default function EmployeeAttendancePage() {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const qs = status ? `?status=${status}` : "";
        const res = await apiFetch<
          ApiResponse<Attendance[]> & { stats: AttendanceStats }
        >(`/attendance/my-attendance${qs}`);
        setRecords(res.data ?? []);
        setStats(res.stats);
      } catch (err) {
        console.error("Failed to load metrics matrix logs", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [status]);

  return (
    <div className="w-full text-neutral-800 dark:text-zinc-100 bg-white dark:bg-zinc-950 min-h-screen transition-colors duration-200">
      {/* Page Heading Title */}
      <div className="mb-8 pb-4 border-b border-neutral-100 dark:border-zinc-800/60">
        <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white uppercase tracking-wider">
          Attendance Ledger
        </h1>
        <p className="text-xs text-neutral-400 dark:text-zinc-500 mt-0.5 font-medium">
          Monitor tracking entry check logs and relative timing synchronization
          metrics.
        </p>
      </div>

      {/* Stats Parameters Grid Section */}
      {stats && (
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            label="Attendance rate"
            value={`${stats.attendanceRate.toFixed(0)}%`}
            icon={TrendingUp}
            tone="brand"
          />
          <StatCard
            label="Present days"
            value={stats.present}
            icon={CalendarCheck}
            tone="brand"
          />
          <StatCard
            label="Late days"
            value={stats.late}
            icon={Clock3}
            tone="warn"
          />
          <StatCard
            label="Absent days"
            value={stats.absent}
            icon={AlertCircle}
            tone="danger"
          />
        </div>
      )}

      {/* Roster Filter Query Frame */}
      <div className="mb-5 flex items-center gap-3">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-10 px-3 rounded-xl border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-neutral-800 dark:text-zinc-200 focus:border-neutral-400 dark:focus:border-zinc-700 outline-none transition-colors w-auto min-w-[160px]"
        >
          <option value="">All Matrix Statuses</option>
          <option value="PRESENT">Present</option>
          <option value="LATE">Late</option>
          <option value="ABSENT">Absent</option>
          <option value="LEAVE">Leave</option>
          <option value="HOLIDAY">Holiday</option>
        </select>
      </div>

      {/* Metrics Ledger Table Container */}
      <div className="border border-neutral-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-neutral-50/30 dark:bg-zinc-900/10 shadow-sm">
        <div className="px-5 py-4 border-b border-neutral-200 dark:border-zinc-800/80 bg-neutral-50 dark:bg-zinc-900/20">
          <span className="text-[10px] font-black tracking-widest text-neutral-400 dark:text-zinc-500 uppercase">
            Logged Timeline Shifts
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-100 dark:border-zinc-800/60 text-[10px] font-bold text-neutral-400 dark:text-zinc-500 uppercase tracking-wider">
                <th className="px-5 py-3.5 font-bold">Timeline Date</th>
                <th className="px-5 py-3.5 font-bold">Check-In Node</th>
                <th className="px-5 py-3.5 font-bold">Check-Out Node</th>
                <th className="px-5 py-3.5 font-bold">Duration Hours</th>
                <th className="px-5 py-3.5 font-bold">Node Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-zinc-800/60 font-medium">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-neutral-400 dark:text-zinc-500 font-medium"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-200 dark:border-zinc-800 border-t-emerald-600 dark:border-t-white" />
                      <span>Syncing roster entries...</span>
                    </div>
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-neutral-400 dark:text-zinc-500 font-medium"
                  >
                    No active timeline tracking matrices detected for this state
                    query.
                  </td>
                </tr>
              ) : (
                records.map((r) => (
                  <tr
                    key={r.id}
                    className="hover:bg-neutral-50/40 dark:hover:bg-zinc-900/20 transition-colors"
                  >
                    <td className="px-5 py-4 font-bold text-neutral-900 dark:text-white">
                      {new Date(r.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-4 text-neutral-600 dark:text-zinc-400 font-mono">
                      {r.checkIn
                        ? new Date(r.checkIn).toLocaleTimeString(undefined, {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </td>
                    <td className="px-5 py-4 text-neutral-600 dark:text-zinc-400 font-mono">
                      {r.checkOut
                        ? new Date(r.checkOut).toLocaleTimeString(undefined, {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </td>
                    <td className="px-5 py-4 text-neutral-600 dark:text-zinc-400 font-mono">
                      {r.totalHours != null
                        ? `${r.totalHours.toFixed(1)} hrs`
                        : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <Badge status={r.status} />
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
