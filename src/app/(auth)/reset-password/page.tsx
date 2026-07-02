"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { AlertCircle, CheckCircle2, HeartPulse } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirm) {
      setError("Passwords do not match. Please verify both fields.");
      return;
    }
    if (!token) {
      setError("This password reset link is invalid or expired.");
      return;
    }

    setLoading(true);
    try {
      await apiFetch("/auth/reset-password", {
        method: "POST",
        skipAuth: true,
        body: JSON.stringify({ token, newPassword }),
      });
      setDone(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not reset your password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 overflow-hidden bg-neutral-900">
      {/* Background Image of a Medical Environment */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105 transition-all duration-700"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200')`,
        }}
      />

      {/* Background Overlay to ensure text readability */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-neutral-950 via-neutral-900/80 to-neutral-950/70 dark:from-zinc-950 dark:via-zinc-950/90 dark:to-zinc-950/80 light:from-white light:via-white/90 light:to-white/80 transition-colors duration-300" />

      {/* Subtle background color accents */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 blur-[140px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[50%] h-[50%] rounded-full bg-emerald-600/5 dark:bg-emerald-400/10 blur-[140px]" />
      </div>

      <div className="relative z-30 w-full max-w-[450px] transition-all duration-300">
        {/* Hospital Brand Logo Header */}
        <div className="mb-6 px-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 group outline-none select-none transition-transform active:scale-95"
            title="Go to Home Page"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20 group-hover:bg-emerald-400 transition-colors">
              <HeartPulse size={18} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase transition-opacity group-hover:opacity-90">
              <span className="text-emerald-500">Medi</span>
              <span className="text-white dark:text-white light:text-neutral-900">
                Track
              </span>
            </span>
          </Link>

          <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-400 light:text-neutral-500 tracking-widest uppercase bg-black/40 dark:bg-black/40 light:bg-neutral-200/60 px-2.5 py-1 rounded-md backdrop-blur-md">
            Security
          </span>
        </div>

        {/* Clean, Translucent Password Reset Container */}
        <div className="bg-black/40 dark:bg-zinc-950/50 light:bg-white/75 border border-white/10 dark:border-zinc-800/60 light:border-neutral-200/80 rounded-3xl p-8 sm:p-11 shadow-2xl backdrop-blur-2xl ring-1 ring-white/5">
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold tracking-tight text-white dark:text-white light:text-neutral-900">
              Choose New Password
            </h1>
          </div>

          {/* Error notice if the link is missing a valid security token */}
          {!token && (
            <div className="mb-5 rounded-xl border border-red-500/20 bg-red-950/30 light:bg-red-50 px-4 py-3 text-xs font-semibold text-red-400 light:text-red-600 tracking-wide flex items-start gap-2">
              <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
              <span>
                This link is incomplete or broken. Please request a new link
                from the{" "}
                <Link
                  href="/forgot-password"
                  className="underline text-white light:text-neutral-900 font-bold"
                >
                  Forgot Password
                </Link>{" "}
                page.
              </span>
            </div>
          )}

          {/* Success Box vs Password Form */}
          {done ? (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/30 light:bg-emerald-50 px-4 py-4 text-xs font-semibold text-emerald-400 light:text-emerald-600 tracking-wide flex items-center gap-2.5">
              <CheckCircle2
                size={16}
                className="flex-shrink-0 text-emerald-500"
              />
              <span>
                Password successfully updated. Redirecting you to the sign-in
                page now...
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-950/30 light:bg-red-50 px-4 py-3 text-xs font-semibold text-red-400 light:text-red-600 tracking-wide flex items-center gap-2">
                  <AlertCircle size={14} className="flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* New Password Input Field */}
              <div className="relative">
                <input
                  id="newPassword"
                  type="password"
                  placeholder=" "
                  className="peer w-full h-14 px-4 pt-5 rounded-xl border border-white/10 dark:border-zinc-800 light:border-neutral-200 bg-black/30 dark:bg-black/40 light:bg-white/80 text-sm font-medium text-white dark:text-zinc-100 light:text-neutral-900 focus:border-emerald-500 dark:focus:border-emerald-500 light:focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all placeholder-transparent"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={!token}
                />
                <label
                  htmlFor="newPassword"
                  className="absolute left-4 top-4 text-xs font-bold text-zinc-500 dark:text-zinc-500 light:text-neutral-400 pointer-events-none transition-all 
                             peer-placeholder-shown:text-sm peer-placeholder-shown:top-4.5 peer-placeholder-shown:font-medium
                             peer-focus:top-2 peer-focus:text-[10px] peer-focus:font-extrabold peer-focus:text-emerald-400 light:peer-focus:text-emerald-600
                             [:not(:placeholder-shown)]:top-2 [:not(:placeholder-shown)]:text-[10px] [:not(:placeholder-shown)]:font-extrabold uppercase tracking-wider"
                >
                  New Password (at least 6 characters)
                </label>
              </div>

              {/* Confirm Password Input Field */}
              <div className="relative">
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder=" "
                  className="peer w-full h-14 px-4 pt-5 rounded-xl border border-white/10 dark:border-zinc-800 light:border-neutral-200 bg-black/30 dark:bg-black/40 light:bg-white/80 text-sm font-medium text-white dark:text-zinc-100 light:text-neutral-900 focus:border-emerald-500 dark:focus:border-emerald-500 light:focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all placeholder-transparent"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  minLength={6}
                  disabled={!token}
                />
                <label
                  htmlFor="confirmPassword"
                  className="absolute left-4 top-4 text-xs font-bold text-zinc-500 dark:text-zinc-500 light:text-neutral-400 pointer-events-none transition-all 
                             peer-placeholder-shown:text-sm peer-placeholder-shown:top-4.5 peer-placeholder-shown:font-medium
                             peer-focus:top-2 peer-focus:text-[10px] peer-focus:font-extrabold peer-focus:text-emerald-400 light:peer-focus:text-emerald-600
                             [:not(:placeholder-shown)]:top-2 [:not(:placeholder-shown)]:text-[10px] [:not(:placeholder-shown)]:font-extrabold uppercase tracking-wider"
                >
                  Confirm New Password
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-black text-white uppercase tracking-wider shadow-lg shadow-emerald-900/20 transition-all active:scale-[0.98] disabled:opacity-50"
                  disabled={loading || !token}
                >
                  {loading ? "Updating password..." : "Update Password"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
