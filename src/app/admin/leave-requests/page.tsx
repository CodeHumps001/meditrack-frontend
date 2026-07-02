"use client";

import { useEffect, useState } from "react";
import { Check, X, Loader2, AlertCircle, CalendarRange } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { ApiResponse, LeaveRequest } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";

export default function AdminLeaveRequestsPage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [status, setStatus] = useState("PENDING");
  const [loading, setLoading] = useState(true);
  const [rejecting, setRejecting] = useState<LeaveRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const qs = status ? `?status=${status}` : "";
      const res = await apiFetch<ApiResponse<LeaveRequest[]>>(
        `/leave/all${qs}`,
      );
      setRequests(res.data ?? []);
    } catch (err) {
      // Handle error gracefully
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [status]);

  async function handleApprove(id: string) {
    setActionError(null);
    try {
      await apiFetch(`/leave/approve/${id}`, { method: "PUT" });
      await load();
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to approve request",
      );
    }
  }

  async function handleReject(e: React.FormEvent) {
    e.preventDefault();
    if (!rejecting) return;
    setActionError(null);
    try {
      await apiFetch(`/leave/reject/${rejecting.id}`, {
        method: "PUT",
        body: JSON.stringify({ rejectionReason }),
      });
      setRejecting(null);
      setRejectionReason("");
      await load();
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to reject request",
      );
    }
  }

  return (
    <div className="w-full min-h-screen px-1 py-4 space-y-6 antialiased selection:bg-emerald-600 selection:text-white">
      {/* Title & Filter Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            Leave Requests Management
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Review, approve, or deny employee time-off logs and tracking
            documentation.
          </p>
        </div>

        <div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:border-emerald-600 text-neutral-800 dark:text-neutral-200 font-medium transition-all cursor-pointer shadow-sm"
          >
            <option value="PENDING">Pending Approval</option>
            <option value="APPROVED">Approved Requests</option>
            <option value="REJECTED">Rejected Requests</option>
            <option value="CANCELLED">Cancelled logs</option>
            <option value="">All Logs</option>
          </select>
        </div>
      </div>

      {/* Action Errors Banner */}
      {actionError && (
        <div className="flex items-start gap-2.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 px-4 py-3 text-xs font-medium text-red-600 dark:text-red-400 leading-relaxed animate-in fade-in duration-200">
          <AlertCircle
            size={14}
            className="mt-0.5 shrink-0 text-red-500 dark:text-red-400"
          />
          <span>{actionError}</span>
        </div>
      )}

      {/* Full Width Table Component Container */}
      <div className="w-full bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-950 text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider border-b border-neutral-200/60 dark:border-neutral-800/60">
                <th className="px-6 py-3.5 font-bold">Employee</th>
                <th className="px-6 py-3.5 font-bold">Type</th>
                <th className="px-6 py-3.5 font-bold">Duration Dates</th>
                <th className="px-6 py-3.5 font-bold">Days</th>
                <th className="px-6 py-3.5 font-bold">Reason Description</th>
                <th className="px-6 py-3.5 font-bold">Status</th>
                <th className="px-6 py-3.5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 text-xs">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-neutral-400 dark:text-neutral-500"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Loader2
                        size={16}
                        className="animate-spin text-emerald-600"
                      />
                      <span>Fetching leave rosters...</span>
                    </div>
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-neutral-400 dark:text-neutral-500"
                  >
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <CalendarRange
                        size={20}
                        className="text-neutral-300 dark:text-neutral-700"
                      />
                      <span>
                        No leave requests logged matching this category.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                requests.map((r) => (
                  <tr
                    key={r.id}
                    className="hover:bg-neutral-50/50 dark:hover:bg-neutral-950/20 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-neutral-900 dark:text-neutral-100">
                      {r.employee?.user
                        ? `${r.employee.user.firstName} ${r.employee.user.lastName}`
                        : "Unknown Staff"}
                    </td>
                    <td className="px-6 py-4 text-neutral-600 dark:text-neutral-300 font-medium capitalize">
                      {r.leaveType.toLowerCase()}
                    </td>
                    <td className="px-6 py-4 text-neutral-500 dark:text-neutral-400 font-medium">
                      {new Date(r.startDate).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      –{" "}
                      {new Date(r.endDate).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 font-semibold text-neutral-700 dark:text-neutral-300">
                      {r.totalDays} {r.totalDays === 1 ? "day" : "days"}
                    </td>
                    <td
                      className="px-6 py-4 text-neutral-500 dark:text-neutral-400 max-w-xs truncate font-medium"
                      title={r.reason}
                    >
                      {r.reason}
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={r.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      {r.status === "PENDING" && (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleApprove(r.id)}
                            className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-emerald-200 dark:hover:border-emerald-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 active:scale-[0.96] transition-all"
                            title="Approve leave request"
                          >
                            <Check size={14} strokeWidth={2.5} />
                          </button>
                          <button
                            onClick={() => setRejecting(r)}
                            className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-red-200 dark:hover:border-red-900 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 dark:text-red-400 active:scale-[0.96] transition-all"
                            title="Reject leave request"
                          >
                            <X size={14} strokeWidth={2.5} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Airbnb Style Decline Context Dialog Modal */}
      <Modal
        open={!!rejecting}
        onClose={() => setRejecting(null)}
        title="Reject leave request"
      >
        <form onSubmit={handleReject} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
              Reason for denial
            </label>
            <textarea
              className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 text-neutral-800 dark:text-neutral-200 transition-all resize-none"
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="State clear reasons or structural conditions for rejecting this request..."
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg active:scale-[0.99] transition-all shadow-sm"
          >
            Decline request
          </button>
        </form>
      </Modal>
    </div>
  );
}
