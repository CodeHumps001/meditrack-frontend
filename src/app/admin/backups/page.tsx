"use client";

import { useEffect, useState } from "react";
import {
  DatabaseBackup,
  Download,
  RotateCcw,
  Trash2,
  Loader2,
  AlertCircle,
  History,
} from "lucide-react";
import { apiFetch, downloadFile } from "@/lib/api";
import { ApiResponse, Backup } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

export default function BackupsPage() {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await apiFetch<ApiResponse<Backup[]>>("/backups");
      setBackups(res.data ?? []);
    } catch (err) {
      // Prevent crash on network breakdown
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate() {
    setCreating(true);
    setError(null);
    try {
      await apiFetch("/backups", { method: "POST" });
      await load();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate system backup matrix",
      );
    } finally {
      setCreating(false);
    }
  }

  async function handleDownload(b: Backup) {
    try {
      await downloadFile(`/backups/${b.id}/download`, b.name);
    } catch (err) {}
  }

  async function handleRestore(b: Backup) {
    if (
      !confirm(
        `Restore database from "${b.name}"? This will overwrite all current snapshot structures.`,
      )
    )
      return;
    setError(null);
    try {
      await apiFetch(`/backups/${b.id}/restore`, { method: "POST" });
      alert("Database matrix state restored successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to execute database restoration matrix",
      );
    }
  }

  async function handleDelete(b: Backup) {
    if (!confirm(`Permanently eliminate backup volume "${b.name}"?`)) return;
    try {
      await apiFetch(`/backups/${b.id}`, { method: "DELETE" });
      await load();
    } catch (err) {}
  }

  return (
    <div className="w-full min-h-screen px-1 py-4 space-y-6 antialiased selection:bg-emerald-600 selection:text-white bg-neutral-50 dark:bg-neutral-950">
      {/* Dynamic Action Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            Database Backups
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Manage infrastructure recovery assets, provision persistent volume
            downloads, and roll back core parameters.
          </p>
        </div>

        <div>
          <button
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-sm active:scale-[0.99]"
            onClick={handleCreate}
            disabled={creating}
          >
            {creating ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <DatabaseBackup size={14} strokeWidth={2.5} />
            )}
            <span>{creating ? "Generating Volume..." : "Create Backup"}</span>
          </button>
        </div>
      </div>

      {/* Modern Exception Error Container */}
      {error && (
        <div className="flex items-start gap-2.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 px-4 py-3 text-xs font-medium text-red-600 dark:text-red-400 leading-relaxed animate-in fade-in duration-200">
          <AlertCircle
            size={14}
            className="mt-0.5 shrink-0 text-red-500 dark:text-red-400"
          />
          <span>{error}</span>
        </div>
      )}

      {/* Persistent Backup Table Roster Card */}
      <div className="w-full bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
        <div className="border-b border-neutral-100 dark:border-neutral-800 px-5 py-4 bg-white dark:bg-neutral-900">
          <h2 className="text-[11px] font-bold text-neutral-900 dark:text-neutral-50 uppercase tracking-wider">
            Available Snapshot Images
          </h2>
        </div>

        <div className="overflow-x-auto w-full bg-white dark:bg-neutral-900">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-950 text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider border-b border-neutral-200/60 dark:border-neutral-800/60">
                <th className="px-5 py-3 font-bold">Image Identifier Name</th>
                <th className="px-5 py-3 font-bold">Volume Allocation Size</th>
                <th className="px-5 py-3 font-bold">Generation Stamp</th>
                <th className="px-5 py-3 font-bold">Cluster Status</th>
                <th className="px-5 py-3 font-bold text-right" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs bg-white dark:bg-neutral-900">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-16 text-center text-neutral-400 dark:text-neutral-500 bg-white dark:bg-neutral-900"
                  >
                    <div className="flex items-center justify-center gap-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                      <Loader2
                        size={16}
                        className="animate-spin text-emerald-600"
                      />
                      <span>Syncing volume manifests...</span>
                    </div>
                  </td>
                </tr>
              ) : backups.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-neutral-400 dark:text-neutral-500 bg-white dark:bg-neutral-900"
                  >
                    <div className="flex flex-col items-center justify-center gap-1.5 max-w-xs mx-auto">
                      <History
                        size={18}
                        className="text-neutral-300 dark:text-neutral-700"
                      />
                      <span className="font-medium">
                        No storage volumes or snapshots found.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                backups.map((b) => (
                  <tr
                    key={b.id}
                    className="hover:bg-neutral-50/50 dark:hover:bg-neutral-950/40 transition-colors bg-white dark:bg-neutral-900"
                  >
                    <td className="px-5 py-3.5 font-mono text-xs font-bold text-neutral-900 dark:text-neutral-100">
                      {b.name}
                    </td>
                    <td className="px-5 py-3.5 text-neutral-700 dark:text-neutral-300 font-semibold">
                      {formatBytes(b.fileSize)}
                    </td>
                    <td className="px-5 py-3.5 text-neutral-600 dark:text-neutral-400 font-medium">
                      {new Date(b.createdAt).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge status={b.status} />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleDownload(b)}
                          className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-950 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all"
                          title="Download Image"
                        >
                          <Download size={13} />
                        </button>
                        <button
                          onClick={() => handleRestore(b)}
                          className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-amber-50 dark:hover:bg-amber-950/20 text-neutral-500 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 transition-all"
                          title="Restore Matrix Snapshot"
                        >
                          <RotateCcw size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(b)}
                          className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-red-100 dark:hover:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-950/20 text-neutral-400 hover:text-red-500 dark:hover:text-red-400 transition-all"
                          title="Destroy Backup"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
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
