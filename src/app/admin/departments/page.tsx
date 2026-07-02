"use client";

import { useEffect, useState, FormEvent } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  AlertCircle,
  Building2,
  Layers,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { ApiResponse, Department } from "@/lib/types";
import { Modal } from "@/components/ui/Modal";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);
  const [form, setForm] = useState({ name: "", code: "", description: "" });
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await apiFetch<ApiResponse<Department[]>>(
        "/departments?limit=100",
      );
      setDepartments(res.data ?? []);
    } catch (err) {
      // Graceful error boundary isolation
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditing(null);
    setForm({ name: "", code: "", description: "" });
    setFormError(null);
    setModalOpen(true);
  }

  function openEdit(dept: Department) {
    setEditing(dept);
    setForm({
      name: dept.name,
      code: dept.code,
      description: dept.description ?? "",
    });
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      if (editing) {
        await apiFetch(`/departments/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
      } else {
        await apiFetch("/departments", {
          method: "POST",
          body: JSON.stringify(form),
        });
      }
      setModalOpen(false);
      await load();
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Failed to save operational department cluster",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(dept: Department) {
    if (
      !confirm(
        `Delete "${dept.name}"? This only works if it has no employees allocated.`,
      )
    )
      return;
    try {
      await apiFetch(`/departments/${dept.id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Failed to eliminate department structure",
      );
    }
  }

  return (
    <div className="w-full min-h-screen px-6 py-8 space-y-6 antialiased selection:bg-emerald-600 selection:text-white">
      {/* Upper Context Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            Departments & Divisions
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Configure institutional cluster paths, manage operational tracking
            codes, and evaluate cross-division metrics.
          </p>
        </div>

        <div>
          <button
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 active:scale-[0.99] transition-all shadow-sm"
            onClick={openCreate}
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>Add Department</span>
          </button>
        </div>
      </div>

      {/* Main Structural Layout Area */}
      {loading ? (
        <div className="w-full py-20 flex items-center justify-center">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
            <Loader2 size={16} className="animate-spin text-emerald-600" />
            <span>Syncing division modules...</span>
          </div>
        </div>
      ) : departments.length === 0 ? (
        <div className="w-full bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-xl py-16 text-center shadow-sm">
          <div className="flex flex-col items-center justify-center gap-2 max-w-xs mx-auto">
            <Building2
              size={24}
              className="text-neutral-300 dark:text-neutral-700"
            />
            <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500">
              No organizational units registered yet.
            </span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {departments.map((d) => (
            <div
              key={d.id}
              className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-xl p-5 shadow-sm flex flex-col justify-between group hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200"
            >
              <div>
                {/* Card Title & Operational Actions Row */}
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
                      {d.name}
                    </h3>
                    <span className="inline-block px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded font-mono text-[10px] font-bold text-neutral-500 dark:text-neutral-400 tracking-wider">
                      {d.code}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 opacity-80 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEdit(d)}
                      className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-950 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 active:scale-95 transition-all"
                      title="Modify configuration"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(d)}
                      className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-red-100 dark:hover:border-red-950/30 hover:bg-red-50 dark:hover:bg-red-950/20 text-neutral-400 hover:text-red-500 dark:hover:text-red-400 active:scale-95 transition-all"
                      title="Eliminate cluster"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Optional Detailed Scope */}
                {d.description && (
                  <p
                    className="text-xs text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed mb-4 line-clamp-2"
                    title={d.description}
                  >
                    {d.description}
                  </p>
                )}
              </div>

              {/* Segment Metric Footer Line */}
              <div className="pt-3 border-t border-neutral-50 dark:border-neutral-850/60 flex items-center gap-1.5 text-[11px] font-bold text-neutral-400 dark:text-neutral-500 tracking-wide">
                <Layers
                  size={12}
                  className="text-neutral-300 dark:text-neutral-700"
                />
                <span>
                  {d.employeeCount ?? 0}{" "}
                  {d.employeeCount === 1
                    ? "Personnel Allocated"
                    : "Personnel Assigned"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Structural Creation / Editing Dialog Modal Box */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Update Department Matrix" : "Create Division Asset"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {formError && (
            <div className="flex items-start gap-2.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 px-4 py-3 text-xs font-medium text-red-600 dark:text-red-400 leading-relaxed">
              <AlertCircle
                size={14}
                className="mt-0.5 shrink-0 text-red-500 dark:text-red-400"
              />
              <span>{formError}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
              Department Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 text-neutral-800 dark:text-neutral-200 transition-all"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Engineering & Development"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
              System Identifier Code (2-10 Upper alphanumeric parameters)
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 font-mono tracking-wider text-neutral-800 dark:text-neutral-200 transition-all uppercase"
              value={form.code}
              onChange={(e) =>
                setForm({ ...form, code: e.target.value.toUpperCase() })
              }
              placeholder="e.g. ENG"
              maxLength={10}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
              Functional Summary Description
            </label>
            <textarea
              className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 text-neutral-800 dark:text-neutral-200 transition-all resize-none"
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="State structural responsibilities or operational scope descriptors allocation..."
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg active:scale-[0.99] transition-all disabled:opacity-50 shadow-sm pt-2"
            disabled={submitting}
          >
            {submitting
              ? "Processing Matrix..."
              : editing
                ? "Save System Matrix"
                : "Deploy Department Asset"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
