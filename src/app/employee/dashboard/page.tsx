"use client";

import { useEffect, useState } from "react";
import { Clock, LogIn, LogOut, MapPin, CheckCircle2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Attendance, ApiResponse } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/Badge";

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [today, setToday] = useState<Attendance | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  async function loadToday() {
    setLoading(true);
    try {
      const res =
        await apiFetch<ApiResponse<Attendance | null>>("/attendance/today");
      setToday(res.data ?? null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load attendance",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadToday();
  }, []);

  function getLocation(): Promise<{ latitude?: number; longitude?: number }> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) return resolve({});
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }),
        () => resolve({}),
        { timeout: 5000 },
      );
    });
  }

  async function handleCheckIn() {
    setActionLoading(true);
    setError(null);
    try {
      const coords = await getLocation();
      await apiFetch("/attendance/check-in", {
        method: "POST",
        body: JSON.stringify(coords),
      });
      await loadToday();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Check-in failed");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCheckOut() {
    setActionLoading(true);
    setError(null);
    try {
      const coords = await getLocation();
      await apiFetch("/attendance/check-out", {
        method: "POST",
        body: JSON.stringify(coords),
      });
      await loadToday();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Check-out failed");
    } finally {
      setActionLoading(false);
    }
  }

  const isCheckedIn = !!today?.checkIn;
  const isCheckedOut = !!today?.checkOut;

  return (
    <div className="w-full text-neutral-800 dark:text-zinc-100 bg-white dark:bg-black min-h-screen transition-colors duration-200">
      {/* Top Banner Row matching image_79fd89.png schema */}
      <div className="flex items-start justify-between mb-10 w-full">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Hello, {user?.firstName || "User"}
          </h1>
          <p className="text-xs text-neutral-400 dark:text-zinc-500 font-medium">
            {now.toLocaleDateString("en-US", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Dynamic Badge Component alignment */}
        <div>
          {today?.status ? (
            <Badge status={today.status} />
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-full uppercase tracking-wider">
              Present
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 px-4 py-3 text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide">
          {error}
        </div>
      )}

      {/* Main Grid View Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT STATION DASHBOARD PANEL CONTROLLER */}
        <div className="lg:col-span-5 bg-neutral-50/60 dark:bg-zinc-900/40 border border-neutral-200 dark:border-zinc-800/80 rounded-2xl p-8 flex flex-col items-center justify-between min-h-[480px] relative shadow-md dark:shadow-2xl backdrop-blur-md">
          <div className="text-center w-full space-y-1">
            <span className="text-[10px] font-black tracking-widest text-neutral-400 dark:text-zinc-500 uppercase">
              Current Station Time
            </span>
            <p className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white tabular-nums">
              {now
                .toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                })
                .toLowerCase()}
            </p>
          </div>

          {/* Centralized Biometric Context Scanning Circle Trigger Station */}
          <div className="relative flex items-center justify-center w-56 h-56 my-4">
            {/* Status Perimeter Verification Dots matching image_79fd89.png visual design */}
            {isCheckedIn && (
              <span className="absolute bottom-4 left-4 z-20 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-black border-2 border-white dark:border-zinc-900 shadow-sm">
                <span className="text-[9px] font-bold">✓</span>
              </span>
            )}
            {isCheckedIn && isCheckedOut && (
              <span className="absolute top-4 right-4 z-20 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-black border-2 border-white dark:border-zinc-900 shadow-sm">
                <span className="text-[9px] font-bold">✓</span>
              </span>
            )}

            {loading ? (
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 dark:border-zinc-700 border-t-emerald-600 dark:border-t-emerald-500" />
            ) : (
              <button
                disabled={actionLoading || (isCheckedIn && isCheckedOut)}
                onClick={isCheckedIn ? handleCheckOut : handleCheckIn}
                className={`w-44 h-44 rounded-full flex flex-col items-center justify-center gap-2 border transition-all duration-300 group outline-none ${
                  isCheckedIn && isCheckedOut
                    ? "bg-neutral-100 dark:bg-zinc-900/60 border-neutral-200 dark:border-zinc-800 text-neutral-400 dark:text-zinc-500"
                    : isCheckedIn
                      ? "bg-white dark:bg-zinc-950 hover:bg-neutral-50 dark:hover:bg-zinc-900 border-red-200 dark:border-red-900/60 hover:border-red-400 dark:hover:border-red-800 text-red-600 dark:text-red-400 shadow-lg shadow-red-100 dark:shadow-red-950/20"
                      : "bg-white dark:bg-zinc-950 hover:bg-neutral-50 dark:hover:bg-zinc-900 border-emerald-200 dark:border-emerald-900/60 hover:border-emerald-400 dark:hover:border-emerald-800 text-emerald-600 dark:text-emerald-400 shadow-lg shadow-emerald-100 dark:shadow-emerald-950/20"
                }`}
              >
                {actionLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : isCheckedIn && isCheckedOut ? (
                  <CheckCircle2
                    size={24}
                    className="text-emerald-600 dark:text-emerald-500 stroke-[1.5]"
                  />
                ) : isCheckedIn ? (
                  <LogOut
                    size={22}
                    className="group-hover:translate-x-0.5 transition-transform stroke-[1.5]"
                  />
                ) : (
                  <LogIn
                    size={22}
                    className="group-hover:-translate-x-0.5 transition-transform stroke-[1.5]"
                  />
                )}

                <span className="text-[10px] font-black tracking-widest uppercase mt-1">
                  {isCheckedIn && isCheckedOut
                    ? "Complete"
                    : isCheckedIn
                      ? "Check Out"
                      : "Check In"}
                </span>
              </button>
            )}
          </div>

          {/* Lower Segment Capsule Bar representing Punch Stamps */}
          <div className="w-full grid grid-cols-2 bg-white dark:bg-zinc-950/80 border border-neutral-200 dark:border-zinc-800 rounded-xl overflow-hidden divide-x divide-neutral-200 dark:divide-zinc-800 py-3.5 text-center shadow-sm">
            <div className="space-y-0.5">
              <span className="block text-[9px] font-black tracking-wider text-neutral-400 dark:text-zinc-500 uppercase">
                Check In
              </span>
              <span className="block text-xs font-bold font-mono text-neutral-800 dark:text-zinc-200">
                {today?.checkIn
                  ? new Date(today.checkIn).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })
                  : "——:——"}
              </span>
            </div>
            <div className="space-y-0.5">
              <span className="block text-[9px] font-black tracking-wider text-neutral-400 dark:text-zinc-500 uppercase">
                Check Out
              </span>
              <span className="block text-xs font-bold font-mono text-neutral-800 dark:text-zinc-200">
                {today?.checkOut
                  ? new Date(today.checkOut).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })
                  : "——:——"}
              </span>
            </div>
          </div>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-[10px] font-medium text-neutral-400 dark:text-zinc-500 tracking-wide">
            <MapPin size={11} className="text-neutral-400 dark:text-zinc-600" />
            Your location will be extracted automatically
          </p>
        </div>

        {/* RIGHT SCHEDULE OVERVIEW CONTENT SECTION */}
        <div className="lg:col-span-7 space-y-5">
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white tracking-wide">
              Your schedule overview
            </h2>
            <p className="text-xs text-neutral-400 dark:text-zinc-500 leading-relaxed font-medium">
              Real-time connection stream logs detailing hours allocated to your
              current rotation framework.
            </p>
          </div>

          {/* Core Embedded Parameter Frame Shell */}
          <div className="border border-neutral-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-neutral-50/30 dark:bg-zinc-900/10 shadow-sm">
            <div className="px-5 py-4 border-b border-neutral-200 dark:border-zinc-800/80 bg-neutral-50 dark:bg-zinc-900/20">
              <span className="text-[10px] font-black tracking-widest text-neutral-400 dark:text-zinc-500 uppercase">
                Current Session Status
              </span>
            </div>

            <div className="p-5 space-y-6 bg-white dark:bg-neutral-900/20">
              <div className="flex items-start gap-2 text-xs font-medium text-neutral-600 dark:text-zinc-300 leading-relaxed">
                <span className="text-sm select-none mt-0.5">✨</span>
                <p>
                  {isCheckedIn && isCheckedOut ? (
                    <>
                      <span className="text-neutral-900 dark:text-white font-bold">
                        Rotation Finished.
                      </span>{" "}
                      Your tracked parameters for today&apos;s roster have been
                      validated and committed cleanly.
                    </>
                  ) : isCheckedIn ? (
                    <>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        Session Active.
                      </span>{" "}
                      You are currently punched into your medical system station
                      rotation window.
                    </>
                  ) : (
                    <>
                      <span className="text-neutral-400 dark:text-zinc-400 font-bold">
                        Awaiting Punch.
                      </span>{" "}
                      No parameters are currently being initialized for your
                      scheduled medical system timeline matrix.
                    </>
                  )}
                </p>
              </div>

              {/* Data Node Parameters Footer Matrix */}
              <div className="grid grid-cols-2 gap-4 pt-5 border-t border-neutral-100 dark:border-zinc-800/60 text-xs">
                <div className="space-y-1">
                  <span className="block text-[10px] font-bold text-neutral-400 dark:text-zinc-500 uppercase tracking-wider">
                    Network Node
                  </span>
                  <span className="block font-mono text-neutral-700 dark:text-zinc-300 font-semibold">
                    secure_auth_v1
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="block text-[10px] font-bold text-neutral-400 dark:text-zinc-500 uppercase tracking-wider">
                    Roster Integrity
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-semibold text-neutral-700 dark:text-zinc-300">
                      Synced
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
