"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Check, Sparkles, Gift, ArrowRight, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { CURRENCIES, CurrencyInfo, detectUserCurrency } from "@/lib/currency";

export function PricingSection() {
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState<string>("INR");

  useEffect(() => {
    const detected = detectUserCurrency();
    setSelectedCurrencyCode(detected);
  }, []);

  const currency: CurrencyInfo = CURRENCIES[selectedCurrencyCode] || CURRENCIES.INR;

  const handleCurrencyChange = (code: string) => {
    setSelectedCurrencyCode(code);
    try {
      localStorage.setItem("drippdf_currency", code);
    } catch (e) {}
  };

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200 dark:border-white/10">
      {/* Section Header */}
      <div className="text-center space-y-4 mb-16">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
          <Gift className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Limited Early Adopter Launch: 100% Free</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Simple, Transparent &{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-violet-600 to-cyan-500">
            Currently 100% Free
          </span>
        </h2>

        <p className="text-sm text-slate-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Because DripPDF Studio processes all files client-side in your browser memory, our server costs are $0. We pass those massive savings directly to you!
        </p>

        {/* Currency Switcher Dropdown (Works on Web, Desktop & Mobile) */}
        <div className="pt-2 flex items-center justify-center">
          <div className="inline-flex items-center space-x-2 bg-white dark:bg-zinc-900/90 border border-slate-300 dark:border-white/10 px-3.5 py-1.5 rounded-2xl shadow-sm">
            <Globe className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Currency:</span>
            <select
              value={selectedCurrencyCode}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-900 dark:text-zinc-100 focus:outline-none cursor-pointer"
            >
              {Object.values(CURRENCIES).map((c) => (
                <option key={c.code} value={c.code} className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100">
                  {c.flag} {c.code} ({c.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {/* Tier 1: Free Starter */}
        <motion.div
          whileHover={{ y: -5 }}
          className="rounded-3xl p-8 bg-white dark:bg-zinc-900/70 border border-slate-200 dark:border-white/10 shadow-lg flex flex-col justify-between space-y-6"
        >
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Community Free</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Essential PDF reading, annotations, and processing for students & casual users.
            </p>
            <div className="flex items-baseline space-x-1 pt-2">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                {currency.symbol}0
              </span>
              <span className="text-xs text-slate-500">/ forever</span>
            </div>

            <div className="h-[1px] bg-slate-100 dark:bg-white/5 my-4" />

            <ul className="space-y-3 text-xs text-slate-700 dark:text-zinc-300">
              <li className="flex items-center space-x-2 font-medium">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>Adobe Reader multi-mode viewer</span>
              </li>
              <li className="flex items-center space-x-2 font-medium">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>Freehand pen & marker highlighting</span>
              </li>
              <li className="flex items-center space-x-2 font-medium">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>Merge, Split & Organize pages</span>
              </li>
              <li className="flex items-center space-x-2 font-medium">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>100% Client-Side Privacy</span>
              </li>
            </ul>
          </div>

          <Link
            href="/reader"
            className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider text-center transition"
          >
            Start Free
          </Link>
        </motion.div>

        {/* Tier 2: Early Adopter Pro (Highlighted) */}
        <motion.div
          whileHover={{ y: -5 }}
          className="rounded-3xl p-8 bg-gradient-to-b from-violet-500/10 via-white to-slate-50 dark:from-violet-600/20 dark:via-zinc-900/90 dark:to-zinc-900 border-2 border-violet-500 shadow-2xl relative flex flex-col justify-between space-y-6 overflow-hidden"
        >
          {/* Glowing badge */}
          <div className="absolute top-0 right-0 bg-gradient-to-l from-violet-600 to-fuchsia-600 text-white text-[10px] font-extrabold uppercase tracking-widest px-4 py-1 rounded-bl-xl shadow-lg">
            Popular • Free Offer
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-violet-600 dark:text-violet-400">
              <Sparkles className="w-4 h-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Early Adopter Pro</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-zinc-400">
              Full Adobe Acrobat Pro + iLovePDF Suite features unlocked for life.
            </p>

            <div className="flex items-baseline space-x-2 pt-2">
              <span className="text-xs text-slate-400 line-through font-bold">
                {currency.symbol}{currency.proPriceMonthly}/mo
              </span>
              <span className="text-4xl font-black text-violet-600 dark:text-violet-400">
                {currency.symbol}0
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">(Launch Special)</span>
            </div>

            <div className="h-[1px] bg-slate-200 dark:bg-white/10 my-4" />

            <ul className="space-y-3 text-xs text-slate-800 dark:text-zinc-200">
              <li className="flex items-center space-x-2 font-medium">
                <Check className="w-4 h-4 text-violet-600 dark:text-violet-400 flex-shrink-0" />
                <span>Digital e-Signature Studio (Draw/Type/Upload)</span>
              </li>
              <li className="flex items-center space-x-2 font-medium">
                <Check className="w-4 h-4 text-violet-600 dark:text-violet-400 flex-shrink-0" />
                <span>AI OCR Optical Character Recognition</span>
              </li>
              <li className="flex items-center space-x-2 font-medium">
                <Check className="w-4 h-4 text-violet-600 dark:text-violet-400 flex-shrink-0" />
                <span>AI Chat with PDF & Instant Summarizer</span>
              </li>
              <li className="flex items-center space-x-2 font-medium">
                <Check className="w-4 h-4 text-violet-600 dark:text-violet-400 flex-shrink-0" />
                <span>Official Adobe Stamp Templates</span>
              </li>
              <li className="flex items-center space-x-2 font-medium">
                <Check className="w-4 h-4 text-violet-600 dark:text-violet-400 flex-shrink-0" />
                <span>Universal Convert Hub (Images ↔ PDF ↔ Text)</span>
              </li>
              <li className="flex items-center space-x-2 font-medium">
                <Check className="w-4 h-4 text-violet-600 dark:text-violet-400 flex-shrink-0" />
                <span>Watermark, Page Numbering & Redaction</span>
              </li>
            </ul>
          </div>

          <Link
            href="/reader"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold text-xs uppercase tracking-wider text-center shadow-lg shadow-violet-600/30 flex items-center justify-center space-x-2 transition"
          >
            <span>Claim Free Lifetime Access</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Tier 3: Enterprise / Team */}
        <motion.div
          whileHover={{ y: -5 }}
          className="rounded-3xl p-8 bg-white dark:bg-zinc-900/70 border border-slate-200 dark:border-white/10 shadow-lg flex flex-col justify-between space-y-6"
        >
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Teams & Enterprise</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              For organizations needing custom branding, API integration, and self-hosted instances.
            </p>
            <div className="flex items-baseline space-x-1 pt-2">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">Custom</span>
            </div>

            <div className="h-[1px] bg-slate-100 dark:bg-white/5 my-4" />

            <ul className="space-y-3 text-xs text-slate-700 dark:text-zinc-300">
              <li className="flex items-center space-x-2 font-medium">
                <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
                <span>Self-hosted on your own domain</span>
              </li>
              <li className="flex items-center space-x-2 font-medium">
                <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
                <span>Custom team branding & logos</span>
              </li>
              <li className="flex items-center space-x-2 font-medium">
                <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
                <span>Better Auth & Postgres team sync</span>
              </li>
              <li className="flex items-center space-x-2 font-medium">
                <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
                <span>Priority 24/7 dedicated support</span>
              </li>
            </ul>
          </div>

          <a
            href="mailto:contact@drippdf.studio"
            className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider text-center transition"
          >
            Contact Team
          </a>
        </motion.div>
      </div>

      {/* Comparison Callout: Save Money Banner */}
      <div className="mt-12 p-6 rounded-3xl bg-emerald-500/10 dark:bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left shadow-sm">
        <div className="space-y-1">
          <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
            💰 Why pay {currency.symbol}{currency.adobeYearlyCost.toLocaleString()}/year for Adobe Acrobat Pro?
          </h4>
          <p className="text-xs text-slate-600 dark:text-zinc-400">
            DripPDF Studio gives you the same viewing, signing, and converting power for {currency.symbol}0 with superior browser privacy.
          </p>
        </div>
        <Link
          href="/reader"
          className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/25 whitespace-nowrap transition"
        >
          Try Free Now
        </Link>
      </div>
    </section>
  );
}
