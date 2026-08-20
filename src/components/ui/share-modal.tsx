"use client";
import React, { useState } from "react";
import {
  Share2,
  Copy,
  Check,
  X,
  Sparkles,
  MessageCircle,
  Send,
  Globe,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export function ShareModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.origin : "https://drippdf.studio";
  const shareTitle = "DripPDF Studio - Free 100% Client-Side Adobe Reader Pro & iLovePDF Suite!";
  const shareText = "I found this insane 100% Free Adobe Acrobat & iLovePDF alternative with zero file limits, e-signatures, AI OCR, and 100% local privacy in your browser! Check it out:";

  const handleCopy = () => {
    navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    setCopied(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    setTimeout(() => setCopied(false), 2500);
  };

  const shareLinks = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "bg-emerald-600 hover:bg-emerald-500",
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
    },
    {
      name: "Twitter / X",
      icon: Globe,
      color: "bg-zinc-800 hover:bg-zinc-700",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}&hashtags=PDF,Productivity,FreeTools,Tech`,
    },
    {
      name: "LinkedIn",
      icon: Globe,
      color: "bg-blue-700 hover:bg-blue-600",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "Telegram",
      icon: Send,
      color: "bg-sky-500 hover:bg-sky-400",
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-3.5 py-1.5 rounded-xl bg-violet-500/10 dark:bg-violet-500/20 hover:bg-violet-500/30 text-violet-600 dark:text-violet-300 border border-violet-500/30 text-xs font-semibold flex items-center space-x-1.5 transition shadow-sm"
        title="Share DripPDF with Friends & Colleagues"
      >
        <Share2 className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Share & Viral</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 shadow-2xl space-y-5 text-zinc-900 dark:text-zinc-100"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-xl bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base">Share DripPDF Studio</h3>
                    <p className="text-[11px] text-zinc-500">
                      Help your friends save $240/yr on Adobe Acrobat subscriptions!
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Social Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {shareLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.name}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2.5 rounded-xl ${item.color} text-white font-semibold text-xs flex items-center justify-center space-x-2 shadow transition`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </a>
                  );
                })}
              </div>

              {/* Copy Link Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Or Copy Direct Link:
                </label>
                <div className="flex items-center space-x-2 bg-zinc-100 dark:bg-zinc-950 p-1.5 rounded-xl border border-zinc-200 dark:border-white/10">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="bg-transparent px-2 text-xs font-mono flex-1 text-zinc-600 dark:text-zinc-300 focus:outline-none"
                  />
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center space-x-1 shadow transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
              </div>

              {/* Viral Banner */}
              <div className="p-3 rounded-xl bg-violet-500/10 dark:bg-violet-500/20 border border-violet-500/30 text-xs text-violet-700 dark:text-violet-300 text-center">
                ✨ <strong>Zero server costs, 100% privacy:</strong> No files are stored or transmitted over the internet.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
