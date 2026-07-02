"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop Veil with Blur Effect */}
      <div
        className="absolute inset-0 bg-zinc-950/40 dark:bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Structural Modal Content Chassis */}
      <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-xl p-5 shadow-xl max-h-[90vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Header Grid Section */}
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-100 dark:border-neutral-800/60">
          <h2 className="text-sm font-bold tracking-tight text-neutral-900 dark:text-neutral-50 uppercase tracking-wide">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 dark:text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-950 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            aria-label="Close modal dialog"
          >
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>

        {/* Children Input/Form Content Node */}
        <div className="text-xs text-neutral-700 dark:text-neutral-300">
          {children}
        </div>
      </div>
    </div>
  );
}
