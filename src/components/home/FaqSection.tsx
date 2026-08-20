"use client";
import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
  {
    q: "Is DripPDF Studio completely free to use?",
    a: "Yes! DripPDF Studio is 100% free during our early adopter launch. All 20+ Adobe Reader & iLovePDF tools — including e-signatures, AI OCR, watermark removal, and PDF conversions — are completely unlocked with no hidden paywalls.",
  },
  {
    q: "Are there any file size or page count limits?",
    a: "No! Unlike traditional online PDF editors with strict 10MB limits, DripPDF Studio processes documents locally in your browser memory. You can view, annotate, and convert large documents with maximum speed.",
  },
  {
    q: "Are my PDF documents safe and private?",
    a: "Yes, 100% private. Unlike cloud PDF services that upload your confidential files to third-party servers, DripPDF executes all operations in your local browser RAM. Your files never touch external servers or databases.",
  },
  {
    q: "How does DripPDF compare to Adobe Acrobat Pro and iLovePDF?",
    a: "Adobe Acrobat Pro costs $19.99/month ($239.88/year) and iLovePDF charges monthly with file size limits on free plans. DripPDF Studio gives you both toolsets in one fast, private workspace with zero cost.",
  },
  {
    q: "Can I use DripPDF Studio on Mobile, Tablet, and Desktop?",
    a: "Yes! DripPDF Studio is designed as a hybrid web-native application. It features touch drawing for iPad/stylus pens, bottom navigation for mobile phones, and a floating dock pro-workbench for desktop computers.",
  },
  {
    q: "How do I add digital signatures and stamps to my PDF?",
    a: "Navigate to the Reader Pro workspace, open your document, and click 'e-Sign' or 'Stamp' in the top toolbar. You can draw your signature, type it in cursive calligraphy fonts, or upload an image, then drag it onto your document and click 'Save PDF' to bake it permanently into the PDF file.",
  },
];

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center space-y-3 mb-12">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-300 text-xs font-semibold">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Everything You Need to Know
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
          Clear answers about privacy, e-signing, AI OCR, and features.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900/60 overflow-hidden transition-all shadow-sm"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left transition hover:bg-slate-50 dark:hover:bg-white/5"
              >
                <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-100 pr-4">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-violet-500 flex-shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed border-t border-slate-100 dark:border-white/5">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
