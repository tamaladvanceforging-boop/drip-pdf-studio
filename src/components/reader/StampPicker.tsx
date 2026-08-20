"use client";
import React from "react";
import { Stamp, Check } from "lucide-react";
import { motion } from "framer-motion";

interface StampPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStamp: (stampLabel: string, color: string) => void;
}

const STAMPS = [
  { label: "APPROVED", color: "#10b981", border: "border-emerald-500", text: "text-emerald-400" },
  { label: "CONFIDENTIAL", color: "#ef4444", border: "border-rose-500", text: "text-rose-400" },
  { label: "REJECTED", color: "#dc2626", border: "border-red-600", text: "text-red-500" },
  { label: "DRAFT", color: "#f59e0b", border: "border-amber-500", text: "text-amber-400" },
  { label: "COMPLETED", color: "#3b82f6", border: "border-blue-500", text: "text-blue-400" },
  { label: "OFFICIAL", color: "#8b5cf6", border: "border-violet-500", text: "text-violet-400" },
  { label: "PAID", color: "#06b6d4", border: "border-cyan-500", text: "text-cyan-400" },
  { label: "VOID", color: "#6b7280", border: "border-zinc-500", text: "text-zinc-400" },
];

export const StampPicker: React.FC<StampPickerProps> = ({
  isOpen,
  onClose,
  onSelectStamp,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <Stamp className="w-5 h-5 text-violet-400" />
            <h3 className="font-bold text-zinc-100">Adobe Stamp Templates</h3>
          </div>
          <button
            onClick={onClose}
            className="text-xs text-zinc-400 hover:text-white px-2 py-1 rounded bg-white/5"
          >
            Close
          </button>
        </div>

        <p className="text-xs text-zinc-400">
          Click any preset stamp to place it directly onto your PDF page.
        </p>

        <div className="grid grid-cols-2 gap-3">
          {STAMPS.map((stamp) => (
            <button
              key={stamp.label}
              onClick={() => {
                onSelectStamp(stamp.label, stamp.color);
                onClose();
              }}
              className={`p-3 rounded-xl border-2 border-dashed ${stamp.border} bg-zinc-950/60 hover:scale-105 transition-all text-center group`}
            >
              <span className={`text-sm font-extrabold tracking-widest uppercase ${stamp.text}`}>
                {stamp.label}
              </span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
