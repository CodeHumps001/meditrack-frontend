"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Loader2,
  AlertCircle,
  Users,
  Copy,
  CheckCircle,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { ApiResponse, Employee, Department } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    departmentId: "",
    position: "",
    employmentType: "FULL_TIME",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function loadEmployees() {
    setLoading(true);
    try {
      const qs = search ? `?search=${encodeURIComponent(search)}` : "";
      const res = await apiFetch<ApiResponse<Employee[]>>(`/employees${qs}`);
      setEmployees(res.data ?? []);
    } catch (err) {
      // Graceful error isolation
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    apiFetch<ApiResponse<Department[]>>("/departments?limit=100")
      .then((res) => setDepartments(res.data ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(loadEmployees, 300);
    return () => clearTimeout(t);
  }, [search]);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        departmentId: form.departmentId || undefined,
      };
      const res = await apiFetch<ApiResponse<{ temporaryPassword: string }>>(
        "/employees",
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
      );
      setTempPassword(res.data?.temporaryPassword ?? null);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        departmentId: "",
        position: "",
        employmentType: "FULL_TIME",
      });
      await loadEmployees();
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Failed to create employee profile",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function closeModal() {
    setModalOpen(false);
    setTempPassword(null);
    setFormError(null);
    setCopied(false);
  }

  function handleCopyPassword() {
    if (!tempPassword) return;
    navigator.clipboard.writeText(tempPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="w-full min-h-screen px-6 py-8 space-y-6 antialiased selection:bg-emerald-600 selection:text-white">
      {/* Upper Context Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            Employee Directory
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Manage corporate access rosters, organize positional tracking slots,
            and review division metrics.
          </p>
        </div>

        <div>
          <button
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 active:scale-[0.99] transition-all shadow-sm shadow-emerald-100 dark:shadow-none"
            onClick={() => setModalOpen(true)}
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Dynamic Filter / Search Toolbar Row */}
      <div className="w-full relative max-w-md">
        <Search
          size={14}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500"
        />
        <input
          type="text"
          className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500 text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 dark:placeholder-neutral-500 shadow-sm transition-all"
          placeholder="Search corporate files by name or email details..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Core Directory Data Frame Box */}
      <div className="w-full bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-950 text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider border-b border-neutral-200/60 dark:border-neutral-800/60">
                <th className="px-6 py-3.5 font-bold">Personnel Member</th>
                <th className="px-6 py-3.5 font-bold">System Identifier ID</th>
                <th className="px-6 py-3.5 font-bold">Department Track</th>
                <th className="px-6 py-3.5 font-bold">Access Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 text-xs">
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-neutral-400 dark:text-neutral-500"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Loader2
                        size={16}
                        className="animate-spin text-emerald-600"
                      />
                      <span>Syncing corporate rosters...</span>
                    </div>
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-neutral-400 dark:text-neutral-500"
                  >
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <Users
                        size={20}
                        className="text-neutral-300 dark:text-neutral-700"
                      />
                      <span>No matching employee entries registered.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-neutral-50/50 dark:hover:bg-neutral-950/20 transition-colors"
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex flex-col space-y-0.5">
                        <Link
                          href={`/admin/employees/${emp.id}`}
                          className="text-neutral-900 dark:text-neutral-100 font-bold hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        >
                          {emp.user
                            ? `${emp.user.firstName} ${emp.user.lastName}`
                            : "Unidentified Member"}
                        </Link>
                        <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-medium">
                          {emp.user?.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-neutral-600 dark:text-neutral-400 font-mono tracking-tight font-medium">
                      {emp.employeeId || "—"}
                    </td>
                    <td className="px-6 py-3.5 text-neutral-700 dark:text-neutral-300 font-semibold">
                      {emp.department?.name ?? (
                        <span className="text-neutral-400 dark:text-neutral-600 font-normal">
                          Unassigned Slot
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge status={emp.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Corporate Creation Dialog Overlay Modal */}
      <Modal open={modalOpen} onClose={closeModal} title="Add Employee Profile">
        {tempPassword ? (
          <div className="space-y-4 pt-1 animate-in fade-in duration-200">
            <div className="flex items-start gap-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 px-4 py-3 text-xs font-medium text-emerald-800 dark:text-emerald-400 leading-relaxed">
              <CheckCircle
                size={14}
                className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400"
              />
              <span>
                Employee profile created. System setup invitation emails have
                been dispatched to the designated address.
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
                Backup Password Credential
              </label>
              <div className="flex gap-2">
                <div className="flex-1 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2.5 font-mono text-xs text-neutral-900 dark:text-neutral-50 select-all overflow-x-auto whitespace-nowrap">
                  {tempPassword}
                </div>
                <button
                  onClick={handleCopyPassword}
                  className="px-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 active:scale-95 transition-all flex items-center justify-center shrink-0"
                  title="Copy password to clipboard"
                >
                  {copied ? (
                    <span className="text-[10px] text-emerald-600 font-bold">
                      Copied
                    </span>
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>
            </div>

            <button
              className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-50 dark:hover:bg-neutral-200 text-white dark:text-neutral-950 text-xs font-bold rounded-lg active:scale-[0.99] transition-all pt-2"
              onClick={closeModal}
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="space-y-4 pt-1">
            {formError && (
              <div className="flex items-start gap-2.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 px-4 py-3 text-xs font-medium text-red-600 dark:text-red-400 leading-relaxed">
                <AlertCircle
                  size={14}
                  className="mt-0.5 shrink-0 text-red-500 dark:text-red-400"
                />
                <span>{formError}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
                  First Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 text-neutral-800 dark:text-neutral-200 transition-all"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
                  Last Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 text-neutral-800 dark:text-neutral-200 transition-all"
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 text-neutral-800 dark:text-neutral-200 transition-all"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
                Department Cluster
              </label>
              <select
                className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 text-neutral-800 dark:text-neutral-200 transition-all cursor-pointer"
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
                  Position/Title
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 text-neutral-800 dark:text-neutral-200 transition-all"
                  value={form.position}
                  onChange={(e) =>
                    setForm({ ...form, position: e.target.value })
                  }
                  placeholder="e.g. Lead Engineer"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
                  Employment Classification
                </label>
                <select
                  className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 text-neutral-800 dark:text-neutral-200 transition-all cursor-pointer"
                  value={form.employmentType}
                  onChange={(e) =>
                    setForm({ ...form, employmentType: e.target.value })
                  }
                >
                  <option value="FULL_TIME">Full-time</option>
                  <option value="PART_TIME">Part-time</option>
                  <option value="CONTRACT">Contract Basis</option>
                  <option value="INTERN">Internship</option>
                  <option value="TRAINEE">Trainee</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg active:scale-[0.99] transition-all disabled:opacity-50 shadow-sm pt-2"
              disabled={submitting}
            >
              {submitting ? "Creating Profile..." : "Create Employee Profile"}
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
}
