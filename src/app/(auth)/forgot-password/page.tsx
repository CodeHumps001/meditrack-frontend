"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { AlertCircle, CheckCircle2, HeartPulse } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await apiFetch("/auth/forgot-password", {
        method: "POST",
        skipAuth: true,
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please check your network and try again.",
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
            Recovery
          </span>
        </div>

        {/* Clean, Translucent Password Recovery Card Container */}
        <div className="bg-black/40 dark:bg-zinc-950/50 light:bg-white/75 border border-white/10 dark:border-zinc-800/60 light:border-neutral-200/80 rounded-3xl p-8 sm:p-11 shadow-2xl backdrop-blur-2xl ring-1 ring-white/5">
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold tracking-tight text-white dark:text-white light:text-neutral-900">
              Reset Password
            </h1>
            {!sent && (
              <p className="mt-2 text-xs font-medium text-zinc-400 dark:text-zinc-400 light:text-neutral-500 leading-normal">
                Enter your hospital email address below, and we will send you a
                secure link to reset your account credentials.
              </p>
            )}
          </div>

          {/* Success Box vs Form Submission */}
          {sent ? (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/30 light:bg-emerald-50 px-4 py-4 text-xs font-semibold text-emerald-400 light:text-emerald-600 tracking-wide flex items-start gap-2.5">
              <CheckCircle2
                size={16}
                className="flex-shrink-0 mt-0.5 text-emerald-500"
              />
              <span>
                If that email address matches our hospital records, a temporary
                password reset link has been sent. Please check your inbox.
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

              {/* Email Input Field */}
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  placeholder=" "
                  className="peer w-full h-14 px-4 pt-5 rounded-xl border border-white/10 dark:border-zinc-800 light:border-neutral-200 bg-black/30 dark:bg-black/40 light:bg-white/80 text-sm font-medium text-white dark:text-zinc-100 light:text-neutral-900 focus:border-emerald-500 dark:focus:border-emerald-500 light:focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all placeholder-transparent"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
                <label
                  htmlFor="email"
                  className="absolute left-4 top-4 text-xs font-bold text-zinc-500 dark:text-zinc-500 light:text-neutral-400 pointer-events-none transition-all 
                             peer-placeholder-shown:text-sm peer-placeholder-shown:top-4.5 peer-placeholder-shown:font-medium
                             peer-focus:top-2 peer-focus:text-[10px] peer-focus:font-extrabold peer-focus:text-emerald-400 light:peer-focus:text-emerald-600
                             [:not(:placeholder-shown)]:top-2 [:not(:placeholder-shown)]:text-[10px] [:not(:placeholder-shown)]:font-extrabold uppercase tracking-wider"
                >
                  Email Address
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-black text-white uppercase tracking-wider shadow-lg shadow-emerald-900/20 transition-all active:scale-[0.98] disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Sending link..." : "Send Reset Link"}
                </button>
              </div>
            </form>
          )}

          {/* Back to Sign In Link Footer */}
          <div className="mt-8 pt-6 border-t border-white/5 dark:border-zinc-800/60 light:border-neutral-200/60 text-center">
            <Link
              href="/login"
              className="text-zinc-400 hover:text-emerald-400 light:text-neutral-500 light:hover:text-emerald-600 text-xs font-black uppercase tracking-wider outline-none transition-colors"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
