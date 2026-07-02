"use client";

import { useEffect, useState, FormEvent } from "react";
import {
  MapPin,
  LocateFixed,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { ApiResponse } from "@/lib/types";

interface LocationSettings {
  name: string;
  latitude: number | null;
  longitude: number | null;
  radiusMeters: number;
}

export default function SettingsPage() {
  const [form, setForm] = useState<LocationSettings>({
    name: "MediTrack Hospital",
    latitude: null,
    longitude: null,
    radiusMeters: 150,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res =
          await apiFetch<ApiResponse<LocationSettings>>("/settings/location");
        if (res.data) setForm(res.data);
      } catch (err) {
        // Fallback default configurations
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function useCurrentLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      setForm((f) => ({
        ...f,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      }));
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (form.latitude == null || form.longitude == null) {
      setError("Latitude and longitude are required.");
      return;
    }

    setSaving(true);
    try {
      await apiFetch("/settings/location", {
        method: "PUT",
        body: JSON.stringify(form),
      });
      setMessage(
        "Geofence updated. Employees must now check in within range of this location.",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[70vh] w-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-600 dark:text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-1 py-4 space-y-6 antialiased selection:bg-emerald-600 selection:text-white">
      {/* Dynamic Header Description Block */}
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
          Location & geofence
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-2xl">
          Employees must check in within this radius of the hospital. Leave
          unset to disable location enforcement entirely (check-in will work
          without location features).
        </p>
      </div>

      {/* Main Container expanded across the entire layout layout view */}
      <div className="w-full bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Status Feedback Banners */}
          {message && (
            <div className="flex items-start gap-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 px-4 py-3 text-xs font-medium text-emerald-800 dark:text-emerald-400 leading-relaxed animate-in fade-in duration-200">
              <CheckCircle2
                size={14}
                className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400"
              />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 px-4 py-3 text-xs font-medium text-red-600 dark:text-red-400 leading-relaxed animate-in fade-in duration-200">
              <AlertCircle
                size={14}
                className="mt-0.5 shrink-0 text-red-500 dark:text-red-400"
              />
              <span>{error}</span>
            </div>
          )}

          {/* Form input stacks */}
          <div className="space-y-1.5 max-w-xl">
            <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
              Location Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 transition-all text-neutral-800 dark:text-neutral-200"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Main Hospital Building"
              required
            />
          </div>

          {/* Core Configuration Layout Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 transition-all text-neutral-800 dark:text-neutral-200"
                value={form.latitude ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    latitude: e.target.value
                      ? parseFloat(e.target.value)
                      : null,
                  })
                }
                placeholder="0.000000"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 transition-all text-neutral-800 dark:text-neutral-200"
                value={form.longitude ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    longitude: e.target.value
                      ? parseFloat(e.target.value)
                      : null,
                  })
                }
                placeholder="0.000000"
              />
            </div>
          </div>

          <div className="max-w-xl">
            <button
              type="button"
              onClick={useCurrentLocation}
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-850 text-neutral-700 dark:text-neutral-300 text-xs font-semibold rounded-lg active:scale-[0.99] transition-all"
            >
              <LocateFixed
                size={14}
                className="text-neutral-400 dark:text-neutral-500"
              />
              Use my current location
            </button>
          </div>

          <div className="space-y-1.5 pt-1 max-w-xl">
            <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
              Radius (meters)
            </label>
            <input
              type="number"
              min={10}
              max={50000}
              className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-neutral-900 transition-all text-neutral-800 dark:text-neutral-200"
              value={form.radiusMeters}
              onChange={(e) =>
                setForm({
                  ...form,
                  radiusMeters: parseInt(e.target.value) || 0,
                })
              }
            />
          </div>

          {/* Form Action Triggers */}
          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none shadow-sm shadow-emerald-100 dark:shadow-none"
              disabled={saving}
            >
              {saving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <MapPin size={14} />
              )}
              {saving ? "Saving changes..." : "Save geofence"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
