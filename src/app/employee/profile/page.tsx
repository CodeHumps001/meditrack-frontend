"use client";

import { useEffect, useState, FormEvent } from "react";
import { apiFetch } from "@/lib/api";
import { ApiResponse, Employee } from "@/lib/types";
import { KeyRound, ShieldAlert, UserCheck } from "lucide-react";

interface ProfileUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  employee: Employee | null;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [form, setForm] = useState({
    gender: "",
    dateOfBirth: "",
    phone: "",
    address: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  });

  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [pwMsg, setPwMsg] = useState<string | null>(null);
  const [pwError, setPwError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await apiFetch<ApiResponse<ProfileUser>>("/auth/profile");
        const p = res.data;
        if (p) {
          setProfile(p);
          setForm({
            gender: p.employee?.gender ?? "",
            dateOfBirth: p.employee?.dateOfBirth?.slice(0, 10) ?? "",
            phone: p.employee?.phone ?? "",
            address: p.employee?.address ?? "",
            emergencyContactName: p.employee?.emergencyContactName ?? "",
            emergencyContactPhone: p.employee?.emergencyContactPhone ?? "",
          });
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSaveProfile(e: FormEvent) {
    e.preventDefault();
    setSaveMsg(null);
    setSaveError(null);

    try {
      // Safely parse local 'YYYY-MM-DD' selector value into ISO String representation
      let isoDateOfBirth = "";
      if (form.dateOfBirth) {
        const localDate = new Date(form.dateOfBirth);
        if (!isNaN(localDate.getTime())) {
          isoDateOfBirth = localDate.toISOString();
        }
      }

      const payload = {
        ...form,
        dateOfBirth: isoDateOfBirth,
      };

      await apiFetch("/employees/profile/complete", {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      setSaveMsg("Profile updated successfully.");
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Failed to update profile",
      );
    }
  }

  async function handleChangePassword(e: FormEvent) {
    e.preventDefault();
    setPwMsg(null);
    setPwError(null);
    try {
      await apiFetch("/employees/profile/change-password", {
        method: "POST",
        body: JSON.stringify(pwForm),
      });
      setPwMsg("Password changed successfully.");
      setPwForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setPwError(
        err instanceof Error ? err.message : "Failed to change password",
      );
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-white dark:bg-black">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-200 dark:border-zinc-800 border-t-emerald-600 dark:border-t-white" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full space-y-8 bg-white dark:bg-black text-neutral-800 dark:text-zinc-100 transition-colors duration-200">
      {/* Title Header Identity */}
      <div className="pb-4 border-b border-neutral-100 dark:border-zinc-800/60">
        <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white uppercase tracking-wider">
          Profile Context
        </h1>
        <p className="text-xs text-neutral-400 dark:text-zinc-500 mt-0.5 font-medium">
          Manage your hospital station parameters and security verification
          access credentials.
        </p>
      </div>

      {/* Account Overview Panel Frame */}
      <div className="bg-neutral-50/60 dark:bg-zinc-900/40 border border-neutral-200 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-2 mb-3 text-[10px] font-black tracking-widest text-neutral-400 dark:text-zinc-500 uppercase">
          <UserCheck
            size={14}
            className="text-emerald-600 dark:text-emerald-500"
          />
          <span>Account Identity Node</span>
        </div>
        <p className="text-sm font-bold text-neutral-900 dark:text-white">
          {profile?.firstName} {profile?.lastName}
          <span className="mx-2 text-neutral-300 dark:text-zinc-700">·</span>
          <span className="text-xs font-medium text-neutral-500 dark:text-zinc-400 font-mono">
            {profile?.email}
          </span>
        </p>
        {profile?.employee && (
          <p className="mt-1.5 text-xs font-semibold text-neutral-400 dark:text-zinc-500">
            ID:{" "}
            <span className="font-mono text-neutral-600 dark:text-zinc-400">
              {profile.employee.employeeId}
            </span>
            <span className="mx-2 text-neutral-300 dark:text-zinc-700">·</span>
            Assignment:{" "}
            <span className="text-neutral-600 dark:text-zinc-400">
              {profile.employee.department?.name ?? "No department assigned"}
            </span>
          </p>
        )}
      </div>

      {/* Personal Details Information Form Frame */}
      <form
        onSubmit={handleSaveProfile}
        className="bg-white dark:bg-zinc-900/10 border border-neutral-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm"
      >
        <div className="px-5 py-4 border-b border-neutral-200 dark:border-zinc-800/80 bg-neutral-50 dark:bg-zinc-900/20">
          <h2 className="text-[10px] font-black tracking-widest text-neutral-400 dark:text-zinc-500 uppercase">
            Personal Parameters
          </h2>
        </div>

        <div className="p-6 space-y-5">
          {saveMsg && (
            <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 px-4 py-2.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
              {saveMsg}
            </div>
          )}
          {saveError && (
            <div className="rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 px-4 py-2.5 text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide">
              {saveError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-neutral-400 dark:text-zinc-500 uppercase tracking-wider">
                Gender
              </label>
              <select
                className="w-full h-10 px-3 rounded-xl border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs font-medium text-neutral-800 dark:text-zinc-200 focus:border-neutral-400 dark:focus:border-zinc-700 outline-none transition-colors"
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
              >
                <option value="">Select</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-neutral-400 dark:text-zinc-500 uppercase tracking-wider">
                Date of birth
              </label>
              <input
                type="date"
                className="w-full h-10 px-3 rounded-xl border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs font-medium text-neutral-800 dark:text-zinc-200 focus:border-neutral-400 dark:focus:border-zinc-700 outline-none transition-colors"
                value={form.dateOfBirth}
                onChange={(e) =>
                  setForm({ ...form, dateOfBirth: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-neutral-400 dark:text-zinc-500 uppercase tracking-wider">
              Phone contact string
            </label>
            <input
              type="text"
              className="w-full h-10 px-3 rounded-xl border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs font-medium font-mono text-neutral-800 dark:text-zinc-200 focus:border-neutral-400 dark:focus:border-zinc-700 outline-none transition-colors"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-neutral-400 dark:text-zinc-500 uppercase tracking-wider">
              Physical residential address
            </label>
            <input
              type="text"
              className="w-full h-10 px-3 rounded-xl border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs font-medium text-neutral-800 dark:text-zinc-200 focus:border-neutral-400 dark:focus:border-zinc-700 outline-none transition-colors"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-neutral-400 dark:text-zinc-500 uppercase tracking-wider">
                Emergency proxy name
              </label>
              <input
                type="text"
                className="w-full h-10 px-3 rounded-xl border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs font-medium text-neutral-800 dark:text-zinc-200 focus:border-neutral-400 dark:focus:border-zinc-700 outline-none transition-colors"
                value={form.emergencyContactName}
                onChange={(e) =>
                  setForm({ ...form, emergencyContactName: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-neutral-400 dark:text-zinc-500 uppercase tracking-wider">
                Emergency proxy phone
              </label>
              <input
                type="text"
                className="w-full h-10 px-3 rounded-xl border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs font-medium font-mono text-neutral-800 dark:text-zinc-200 focus:border-neutral-400 dark:focus:border-zinc-700 outline-none transition-colors"
                value={form.emergencyContactPhone}
                onChange={(e) =>
                  setForm({ ...form, emergencyContactPhone: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-neutral-50 dark:bg-zinc-900/10 border-t border-neutral-100 dark:border-zinc-800/60 flex justify-end">
          <button
            type="submit"
            className="h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-xs font-bold text-white uppercase tracking-wider shadow-sm transition-all active:scale-[0.98]"
          >
            Save parameters
          </button>
        </div>
      </form>

      {/* Security Credentials Password Frame */}
      <form
        onSubmit={handleChangePassword}
        className="bg-white dark:bg-zinc-900/10 border border-neutral-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm"
      >
        <div className="px-5 py-4 border-b border-neutral-200 dark:border-zinc-800/80 bg-neutral-50 dark:bg-zinc-900/20">
          <h2 className="text-[10px] font-black tracking-widest text-neutral-400 dark:text-zinc-500 uppercase flex items-center gap-1.5">
            <KeyRound size={12} className="text-neutral-400" />
            <span>Access Key Management</span>
          </h2>
        </div>

        <div className="p-6 space-y-5">
          {pwMsg && (
            <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 px-4 py-2.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
              {pwMsg}
            </div>
          )}
          {pwError && (
            <div className="rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 px-4 py-2.5 text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide">
              {pwError}
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-neutral-400 dark:text-zinc-500 uppercase tracking-wider">
              Current authentication pass
            </label>
            <input
              type="password"
              className="w-full h-10 px-3 rounded-xl border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs font-medium text-neutral-800 dark:text-zinc-200 focus:border-neutral-400 dark:focus:border-zinc-700 outline-none transition-colors"
              value={pwForm.currentPassword}
              onChange={(e) =>
                setPwForm({ ...pwForm, currentPassword: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-neutral-400 dark:text-zinc-500 uppercase tracking-wider">
              New verification pass sequence
            </label>
            <input
              type="password"
              className="w-full h-10 px-3 rounded-xl border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs font-medium text-neutral-800 dark:text-zinc-200 focus:border-neutral-400 dark:focus:border-zinc-700 outline-none transition-colors"
              value={pwForm.newPassword}
              onChange={(e) =>
                setPwForm({ ...pwForm, newPassword: e.target.value })
              }
              required
              minLength={6}
            />
          </div>
        </div>

        <div className="px-6 py-4 bg-neutral-50 dark:bg-zinc-900/10 border-t border-neutral-100 dark:border-zinc-800/60 flex justify-end">
          <button
            type="submit"
            className="h-9 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-neutral-950 text-xs font-bold text-white uppercase tracking-wider shadow-sm transition-all active:scale-[0.98]"
          >
            Update credentials
          </button>
        </div>
      </form>
    </div>
  );
}
