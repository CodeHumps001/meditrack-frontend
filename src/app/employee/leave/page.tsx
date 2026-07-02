"use client";

import { useEffect, useState, FormEvent } from "react";
import { Plus, ShieldAlert } from "lucide-react";
import { apiFetch } from "@/lib/api";
import {
  LeaveRequest,
  LeaveBalanceStats,
  ApiResponse,
  LeaveType,
} from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";

const LEAVE_TYPES: LeaveType[] = [
  "ANNUAL",
  "SICK",
  "MATERNITY",
  "PATERNITY",
  "BEREAVEMENT",
  "STUDY",
  "UNPAID",
  "OTHER",
];

export default function LeavePage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [balance, setBalance] = useState<LeaveBalanceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    leaveType: "ANNUAL" as LeaveType,
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function loadAll() {
    setLoading(true);
    try {
      const [reqRes, balRes] = await Promise.all([
        apiFetch<ApiResponse<LeaveRequest[]>>("/leave/my-requests"),
        apiFetch<ApiResponse<LeaveBalanceStats>>("/leave/my-balance"),
      ]);
      setRequests(reqRes.data ?? []);
      setBalance(balRes.data ?? null);
    } catch (err) {
      console.error("Failed to sync matrix overview logs", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function handleApply(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      let isoStartDate = "";
      let isoEndDate = "";

      if (form.startDate) {
        const startLocal = new Date(form.startDate);
        if (!isNaN(startLocal.getTime()))
          isoStartDate = startLocal.toISOString();
      }
      if (form.endDate) {
        const endLocal = new Date(form.endDate);
        if (!isNaN(endLocal.getTime())) isoEndDate = endLocal.toISOString();
      }

      const payload = {
        ...form,
        startDate: isoStartDate,
        endDate: isoEndDate,
      };

      await apiFetch("/leave/apply", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setModalOpen(false);
      setForm({ leaveType: "ANNUAL", startDate: "", endDate: "", reason: "" });
      await loadAll();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to apply for leave",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCancel(id: string) {
    if (!confirm("Cancel this leave request?")) return;
    try {
      await apiFetch(`/leave/cancel/${id}`, { method: "PUT" });
      await loadAll();
    } catch (err) {
      console.error("Cancellation stream error", err);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-white dark:bg-zinc-950 text-neutral-800 dark:text-zinc-100 transition-colors duration-200">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-200 dark:border-zinc-800 border-t-emerald-600 dark:border-t-white" />
      </div>
    );
  }

  return (
    <div className="w-full text-neutral-800 dark:text-zinc-100 bg-white dark:bg-zinc-950 min-h-screen transition-colors duration-200">
      {/* Top Banner Header Section */}
      <div className="mb-8 flex flex-col gap-4 pb-6 border-b border-neutral-100 dark:border-zinc-800/60 sm:flex-row sm:items-center sm:justify-between sm:pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white uppercase tracking-wider">
            Leave Ledger
          </h1>
          <p className="text-xs text-neutral-400 dark:text-zinc-500 mt-0.5 font-medium">
            Review roster allocation balances and manage calendar parameter
            departures.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-neutral-950 text-xs font-bold uppercase tracking-wider shadow-sm transition-all active:scale-[0.98] w-full sm:w-auto"
        >
          <Plus size={14} strokeWidth={2.5} />
          <span>Apply for leave</span>
        </button>
      </div>

      {/* Balance Threshold Metric Cards Container */}
      {balance && (
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            ["Annual", balance.balance.annual],
            ["Sick", balance.balance.sick],
            ["Study", balance.balance.study],
            ["Other", balance.balance.other],
          ].map(([label, value]) => (
            <div
              key={label as string}
              className="bg-neutral-50/60 dark:bg-zinc-900/40 border border-neutral-200 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm backdrop-blur-md"
            >
              <span className="block text-[10px] font-black tracking-widest text-neutral-400 dark:text-zinc-500 uppercase">
                {label} Allocation
              </span>
              <p className="mt-2 text-2xl font-bold tracking-tight text-neutral-900 dark:text-white tabular-nums">
                {value}{" "}
                <span className="text-[10px] font-medium text-neutral-400 dark:text-zinc-500 lowercase">
                  days remaining
                </span>
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Primary Requests System Table Frame */}
      <div className="border border-neutral-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-neutral-50/30 dark:bg-zinc-900/10 shadow-sm">
        <div className="px-5 py-4 border-b border-neutral-200 dark:border-zinc-800/80 bg-neutral-50 dark:bg-zinc-900/20">
          <span className="text-[10px] font-black tracking-widest text-neutral-400 dark:text-zinc-500 uppercase">
            Active Framework Requests
          </span>
        </div>

        {/* DESKTOP VIEW: Standard Table layout (Hidden on mobile screens) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-100 dark:border-zinc-800/60 text-[10px] font-bold text-neutral-400 dark:text-zinc-500 uppercase tracking-wider">
                <th className="px-5 py-3.5 font-bold">Type Matrix</th>
                <th className="px-5 py-3.5 font-bold">Timeline Dates</th>
                <th className="px-5 py-3.5 font-bold">Total Days</th>
                <th className="px-5 py-3.5 font-bold">Node Status</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-zinc-800/60 font-medium">
              {requests.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-neutral-400 dark:text-zinc-500 font-medium"
                  >
                    No active departure request logs detected in database
                    roster.
                  </td>
                </tr>
              ) : (
                requests.map((r) => (
                  <tr
                    key={r.id}
                    className="hover:bg-neutral-50/40 dark:hover:bg-zinc-900/20 transition-colors"
                  >
                    <td className="px-5 py-4 font-bold text-neutral-900 dark:text-white">
                      {r.leaveType}
                    </td>
                    <td className="px-5 py-4 text-neutral-600 dark:text-zinc-400 font-mono">
                      {new Date(r.startDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      –{" "}
                      {new Date(r.endDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-4 text-neutral-600 dark:text-zinc-400 font-mono">
                      {r.totalDays} d
                    </td>
                    <td className="px-5 py-4">
                      <Badge status={r.status} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      {r.status === "PENDING" && (
                        <button
                          onClick={() => handleCancel(r.id)}
                          className="text-[10px] font-black uppercase tracking-wider text-red-600 dark:text-red-400 hover:underline outline-none bg-transparent border-none p-0 cursor-pointer"
                        >
                          Cancel Block
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE VIEW: Cards stack layout (Hidden on desktop monitors) */}
        <div className="block sm:hidden divide-y divide-neutral-100 dark:divide-zinc-800/60">
          {requests.length === 0 ? (
            <div className="px-5 py-12 text-center text-neutral-400 dark:text-zinc-500 text-xs font-medium">
              No active departure request logs detected in database roster.
            </div>
          ) : (
            requests.map((r) => (
              <div
                key={r.id}
                className="p-5 space-y-3 bg-white/40 dark:bg-transparent"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-900 dark:text-white">
                    {r.leaveType}
                  </span>
                  <Badge status={r.status} />
                </div>

                <div className="flex items-center justify-between text-[11px] font-medium text-neutral-500 dark:text-zinc-400">
                  <div className="font-mono">
                    {new Date(r.startDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    –{" "}
                    {new Date(r.endDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <div className="font-mono bg-neutral-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
                    {r.totalDays} days
                  </div>
                </div>

                {r.status === "PENDING" && (
                  <div className="pt-1 flex justify-end">
                    <button
                      onClick={() => handleCancel(r.id)}
                      className="w-full text-center py-2 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 outline-none transition-colors cursor-pointer border-none"
                    >
                      Cancel Block
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Interactive Modal Sheet Application Form */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Apply for leave"
      >
        <form onSubmit={handleApply} className="space-y-5 pt-2">
          {formError && (
            <div className="rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 px-4 py-2.5 text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide flex items-center gap-2">
              <ShieldAlert size={14} />
              <span>{formError}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-neutral-400 dark:text-zinc-500 uppercase tracking-wider">
              Leave Matrix Type
            </label>
            <select
              className="w-full h-10 px-3 rounded-xl border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-neutral-800 dark:text-zinc-200 focus:border-neutral-400 dark:focus:border-zinc-700 outline-none transition-colors"
              value={form.leaveType}
              onChange={(e) =>
                setForm({ ...form, leaveType: e.target.value as LeaveType })
              }
            >
              {LEAVE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-neutral-400 dark:text-zinc-500 uppercase tracking-wider">
                Start Parameter
              </label>
              <input
                type="date"
                className="w-full h-10 px-3 rounded-xl border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-neutral-800 dark:text-zinc-200 focus:border-neutral-400 dark:focus:border-zinc-700 outline-none transition-colors"
                value={form.startDate}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-neutral-400 dark:text-zinc-500 uppercase tracking-wider">
                End Parameter
              </label>
              <input
                type="date"
                className="w-full h-10 px-3 rounded-xl border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-neutral-800 dark:text-zinc-200 focus:border-neutral-400 dark:focus:border-zinc-700 outline-none transition-colors"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-neutral-400 dark:text-zinc-500 uppercase tracking-wider">
              Justification Statement
            </label>
            <textarea
              className="w-full p-3 rounded-xl border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-neutral-800 dark:text-zinc-200 focus:border-neutral-400 dark:focus:border-zinc-700 outline-none transition-colors resize-none"
              rows={3}
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              placeholder="Provide clean logging data context justifying rotation framework adjustments..."
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-xs font-bold text-white uppercase tracking-wider shadow-sm transition-all active:scale-[0.98] disabled:opacity-50"
              disabled={submitting}
            >
              {submitting
                ? "Processing Matrix Request..."
                : "Commit Stream Request"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
