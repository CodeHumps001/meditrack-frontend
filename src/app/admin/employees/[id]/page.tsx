"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  UserX,
  Loader2,
  Save,
  CheckCircle2,
  History,
  CalendarClock,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import {
  ApiResponse,
  Employee,
  Department,
  Attendance,
  LeaveRequest,
} from "@/lib/types";
import { Badge } from "@/components/ui/Badge";

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [employee, setEmployee] = useState<
    | (Employee & { attendance?: Attendance[]; leaveRequests?: LeaveRequest[] })
    | null
  >(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const [form, setForm] = useState({
    departmentId: "",
    position: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    async function load() {
      try {
        const [empRes, depRes] = await Promise.all([
          apiFetch<
            ApiResponse<
              Employee & {
                attendance: Attendance[];
                leaveRequests: LeaveRequest[];
              }
            >
          >(`/employees/${id}`),
          apiFetch<ApiResponse<Department[]>>("/departments?limit=100"),
        ]);
        if (empRes.data) {
          setEmployee(empRes.data);
          setForm({
            departmentId: empRes.data.departmentId ?? "",
            position: empRes.data.position ?? "",
            status: empRes.data.status,
          });
        }
        setDepartments(depRes.data ?? []);
      } catch (err) {
        // Safe isolation boundary
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleSave() {
    setSaving(true);
    setSaveMsg(null);
    try {
      await apiFetch(`/employees/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          departmentId: form.departmentId || undefined,
          position: form.position,
          status: form.status,
        }),
      });
      setSaveMsg("Profile properties saved successfully.");
      setTimeout(() => setSaveMsg(null), 3000);
    } catch (err) {
      // Quiet failure boundary
    } finally {
      setSaving(false);
    }
  }

  async function handleDeactivate() {
    if (!confirm("Deactivate this employee? Their account will be disabled."))
      return;
    try {
      await apiFetch(`/employees/${id}`, { method: "DELETE" });
      router.push("/admin/employees");
    } catch (err) {
      // Safe boundary
    }
  }

  if (loading || !employee) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
          <Loader2 size={16} className="animate-spin text-emerald-600" />
          <span>Fetching profile configuration...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-6 py-8 space-y-6 antialiased selection:bg-emerald-600 selection:text-white">
      {/* Navigation Return Button */}
      <div>
        <button
          onClick={() => router.push("/admin/employees")}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors group"
        >
          <ArrowLeft
            size={14}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          <span>Back to directory</span>
        </button>
      </div>

      {/* Profile Overview Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            {employee.user
              ? `${employee.user.firstName} ${employee.user.lastName}`
              : "Unknown Member"}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium leading-none">
            ID:{" "}
            <span className="font-mono text-neutral-600 dark:text-neutral-300">
              {employee.employeeId || "—"}
            </span>{" "}
            · {employee.user?.email}
          </p>
        </div>
        <div className="sm:self-start">
          <Badge status={employee.status} />
        </div>
      </div>

      {/* Structural Setup Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side: Control & Configuration Panel */}
        <div className="lg:col-span-1 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-xl p-5 shadow-sm space-y-5">
          <h2 className="text-[11px] font-bold text-neutral-950 dark:text-neutral-50 uppercase tracking-wider">
            Employment Parameters
          </h2>

          {saveMsg && (
            <div className="flex items-start gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 px-3 py-2.5 text-[11px] font-medium text-emerald-800 dark:text-emerald-400 leading-relaxed animate-in fade-in duration-200">
              <CheckCircle2
                size={13}
                className="shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400"
              />
              <span>{saveMsg}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
                Department Cluster
              </label>
              <select
                className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500 text-neutral-800 dark:text-neutral-200 transition-all cursor-pointer"
                value={form.departmentId}
                onChange={(e) =>
                  setForm({ ...form, departmentId: e.target.value })
                }
              >
                <option value="">Unassigned Slot</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
                Position/Title
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500 text-neutral-800 dark:text-neutral-200 transition-all"
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
                System Status Flag
              </label>
              <select
                className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500 text-neutral-800 dark:text-neutral-200 transition-all cursor-pointer"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="ON_LEAVE">On leave</option>
                <option value="TERMINATED">Terminated</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-850 flex flex-col sm:flex-row gap-2">
            <button
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 active:scale-[0.99] transition-all disabled:opacity-50"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Save size={13} />
              )}
              <span>{saving ? "Saving..." : "Save changes"}</span>
            </button>
            <button
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 dark:text-red-400 text-xs font-semibold rounded-lg active:scale-[0.99] transition-all"
              onClick={handleDeactivate}
            >
              <UserX size={13} />
              <span>Deactivate</span>
            </button>
          </div>
        </div>

        {/* Right Side: Historical Logs Tables Stack */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section: Recent Attendance Tracker */}
          <div className="w-full bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
            <div className="border-b border-neutral-100 dark:border-neutral-850 px-5 py-3.5">
              <h2 className="text-[11px] font-bold text-neutral-900 dark:text-neutral-50 uppercase tracking-wider">
                Recent Attendance Logs
              </h2>
            </div>
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50 dark:bg-neutral-950 text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider border-b border-neutral-200/60 dark:border-neutral-800/60">
                    <th className="px-5 py-2.5 font-bold">Log Date</th>
                    <th className="px-5 py-2.5 font-bold">Check-in Stamp</th>
                    <th className="px-5 py-2.5 font-bold">Metrics Badge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 text-xs">
                  {(employee.attendance ?? []).length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-5 py-8 text-center text-neutral-400 dark:text-neutral-500"
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          <History
                            size={14}
                            className="text-neutral-300 dark:text-neutral-700"
                          />
                          <span>No structural attendance records found.</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    employee.attendance!.map((a) => (
                      <tr
                        key={a.id}
                        className="hover:bg-neutral-50/50 dark:hover:bg-neutral-950/10 transition-colors"
                      >
                        <td className="px-5 py-3 font-semibold text-neutral-900 dark:text-neutral-100">
                          {new Date(a.date).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-5 py-3 text-neutral-600 dark:text-neutral-400 font-mono tracking-tight">
                          {a.checkIn
                            ? new Date(a.checkIn).toLocaleTimeString(
                                undefined,
                                { hour: "2-digit", minute: "2-digit" },
                              )
                            : "—"}
                        </td>
                        <td className="px-5 py-3">
                          <Badge status={a.status} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section: Leave Rosters History */}
          <div className="w-full bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
            <div className="border-b border-neutral-100 dark:border-neutral-850 px-5 py-3.5">
              <h2 className="text-[11px] font-bold text-neutral-900 dark:text-neutral-50 uppercase tracking-wider">
                Recent Leave Requests Tracker
              </h2>
            </div>
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50 dark:bg-neutral-950 text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider border-b border-neutral-200/60 dark:border-neutral-800/60">
                    <th className="px-5 py-2.5 font-bold">Category</th>
                    <th className="px-5 py-2.5 font-bold">Inclusive Dates</th>
                    <th className="px-5 py-2.5 font-bold">Status Badge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 text-xs">
                  {(employee.leaveRequests ?? []).length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-5 py-8 text-center text-neutral-400 dark:text-neutral-500"
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          <CalendarClock
                            size={14}
                            className="text-neutral-300 dark:text-neutral-700"
                          />
                          <span>
                            No leave tracking documentation submitted.
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    employee.leaveRequests!.map((l) => (
                      <tr
                        key={l.id}
                        className="hover:bg-neutral-50/50 dark:hover:bg-neutral-950/10 transition-colors"
                      >
                        <td className="px-5 py-3 font-semibold text-neutral-900 dark:text-neutral-100 capitalize">
                          {l.leaveType.toLowerCase().replace("_", " ")}
                        </td>
                        <td className="px-5 py-3 text-neutral-600 dark:text-neutral-400 font-medium">
                          {new Date(l.startDate).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}{" "}
                          –{" "}
                          {new Date(l.endDate).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-5 py-3">
                          <Badge status={l.status} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
