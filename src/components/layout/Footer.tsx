import React from "react";
import Link from "next/link";
import { Sparkles, Shield, Zap, Laptop, Smartphone, Tablet } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-white/[0.08] bg-zinc-950/80 backdrop-blur-xl relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                DripPDF Studio
              </span>
            </div>
            <p className="text-sm text-zinc-400 max-w-md leading-relaxed">
              The ultimate hybrid PDF powerhouse combining complete **Adobe Reader Pro** interactive annotation/signing with **iLovePDF** 20+ processing tools. Powered by Next.js, Aceternity UI, and Three.js.
            </p>
            <div className="flex items-center space-x-4 text-xs text-zinc-500">
              <span className="flex items-center space-x-1">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Client-Side Privacy</span>
              </span>
              <span className="flex items-center space-x-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Zero Cloud Latency</span>
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 mb-3">
              Adobe Reader Tools
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><Link href="/reader" className="hover:text-violet-400 transition">Multi-Page Reader</Link></li>
              <li><Link href="/reader" className="hover:text-violet-400 transition">Pen & Highlighting</Link></li>
              <li><Link href="/reader" className="hover:text-violet-400 transition">Digital e-Signatures</Link></li>
              <li><Link href="/reader" className="hover:text-violet-400 transition">Stamps & Redaction</Link></li>
            </ul>
          </div>

          {/* iLovePDF suite */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 mb-3">
              iLovePDF Suite
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><Link href="/tools/merge" className="hover:text-violet-400 transition">Merge & Split PDF</Link></li>
              <li><Link href="/tools/organize" className="hover:text-violet-400 transition">Organize & Rotate</Link></li>
              <li><Link href="/tools/compress" className="hover:text-violet-400 transition">Compress PDF</Link></li>
              <li><Link href="/tools/convert" className="hover:text-violet-400 transition">Convert PDF & Images</Link></li>
              <li><Link href="/tools/ocr" className="hover:text-violet-400 transition">AI OCR Extractor</Link></li>
            </ul>
          </div>
        </div>

        {/* Device Badges & Copyright */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center space-x-3">
            <span className="text-zinc-400">Hybrid Native:</span>
            <span className="flex items-center space-x-1 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[11px]">
              <Smartphone className="w-3 h-3 text-violet-400" />
              <span>Mobile</span>
            </span>
            <span className="flex items-center space-x-1 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[11px]">
              <Tablet className="w-3 h-3 text-cyan-400" />
              <span>Tablet</span>
            </span>
            <span className="flex items-center space-x-1 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[11px]">
              <Laptop className="w-3 h-3 text-fuchsia-400" />
              <span>Desktop</span>
            </span>
          </div>

          <div>
            © {new Date().getFullYear()} DripPDF Studio. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
