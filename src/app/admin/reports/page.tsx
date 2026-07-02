"use client";

import { useState, useEffect } from "react";
import { FileDown, FileSpreadsheet, Loader2, BarChart3 } from "lucide-react";
import { apiFetch, downloadFile } from "@/lib/api";
import { ApiResponse, Department } from "@/lib/types";

type ReportType = "attendance" | "leave" | "employees";

export default function ReportsPage() {
  const [reportType, setReportType] = useState<ReportType>("attendance");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentId, setDepartmentId] = useState("");
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d.toISOString().slice(0, 10);
  });
  const [endDate, setEndDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [summary, setSummary] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState<"excel" | "pdf" | null>(null);

  useEffect(() => {
    apiFetch<ApiResponse<Department[]>>("/departments?limit=100")
      .then((res) => setDepartments(res.data ?? []))
      .catch(() => {});
  }, []);

  const needsDateRange = reportType !== "employees";

  function buildQuery(format?: "excel" | "pdf") {
    const params = new URLSearchParams();
    if (needsDateRange) {
      params.set("startDate", startDate);
      params.set("endDate", endDate);
    }
    if (departmentId) params.set("departmentId", departmentId);
    if (format) params.set("format", format);
    return params.toString();
  }

  async function handleView() {
    setLoading(true);
    try {
      const res = await apiFetch<ApiResponse<Record<string, unknown>>>(
        `/reports/${reportType}?${buildQuery()}`,
      );
      setSummary(
        ((res.data as Record<string, unknown>)?.stats as Record<
          string,
          unknown
        >) ??
          res.data ??
          null,
      );
    } catch (err) {
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleExport(format: "excel" | "pdf") {
    setExporting(format);
    try {
      const ext = format === "excel" ? "xlsx" : "pdf";
      await downloadFile(
        `/reports/${reportType}?${buildQuery(format)}`,
        `${reportType}-report.${ext}`,
      );
    } catch (err) {
      // Quiet fail error handling
    } finally {
      setExporting(null);
    }
  }

  return (
    <div className="w-full min-h-screen px-1 py-4 space-y-6 antialiased selection:bg-emerald-600 selection:text-white">
      {/* Title Header */}
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
          Reports & Analytics
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-2xl leading-relaxed">
          Filter data parameters across systemic metrics to evaluate metrics,
          compile official logs, or export spreadsheets.
        </p>
      </div>

      {/* Filter Parameters Controls Board */}
      <div className="w-full bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-xl p-6 shadow-sm space-y-6">
        {/* Responsive Grid Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
              Report Type
            </label>
            <select
              className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 text-neutral-800 dark:text-neutral-200 transition-all cursor-pointer"
              value={reportType}
              onChange={(e) => setReportType(e.target.value as ReportType)}
            >
              <option value="attendance">Attendance Records</option>
              <option value="leave">Leave Balance logs</option>
              <option value="employees">Employee Demographics</option>
            </select>
          </div>

          {needsDateRange && (
            <>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
                  Start Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 text-neutral-800 dark:text-neutral-200 transition-all"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
                  End Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 text-neutral-800 dark:text-neutral-200 transition-all"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
              Department Group
            </label>
            <select
              className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 text-neutral-800 dark:text-neutral-200 transition-all cursor-pointer"
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Controls Footer Row */}
        <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap gap-2.5">
          <button
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none shadow-sm shadow-emerald-100 dark:shadow-none"
            onClick={handleView}
            disabled={loading}
          >
            {loading ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <BarChart3 size={13} />
            )}
            {loading ? "Compiling stats..." : "View Summary"}
          </button>

          <button
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-850 text-neutral-700 dark:text-neutral-300 text-xs font-semibold rounded-lg active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none"
            onClick={() => handleExport("excel")}
            disabled={exporting === "excel"}
          >
            {exporting === "excel" ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <FileSpreadsheet
                size={13}
                className="text-emerald-600 dark:text-emerald-400"
              />
            )}
            {exporting === "excel" ? "Exporting..." : "Export Excel"}
          </button>

          <button
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-850 text-neutral-700 dark:text-neutral-300 text-xs font-semibold rounded-lg active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none"
            onClick={() => handleExport("pdf")}
            disabled={exporting === "pdf"}
          >
            {exporting === "pdf" ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <FileDown size={13} className="text-red-500 dark:text-red-400" />
            )}
            {exporting === "pdf" ? "Exporting..." : "Export PDF"}
          </button>
        </div>
      </div>

      {/* Compiled Summary Stats Blocks */}
      {summary && (
        <div className="w-full bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-xl p-6 shadow-sm space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h2 className="text-xs font-bold text-neutral-900 dark:text-neutral-50 uppercase tracking-wider">
            Compiled Summary Data Overview
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 pt-2">
            {Object.entries(summary).map(([key, value]) => (
              <div
                key={key}
                className="space-y-1 border-l-2 border-neutral-100 dark:border-neutral-800 pl-3"
              >
                <p className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest truncate">
                  {key.replace(/([A-Z])/g, " $1")}
                </p>
                <p className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                  {typeof value === "number" ? value : JSON.stringify(value)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
