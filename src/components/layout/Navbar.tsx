"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Layers,
  Scissors,
  Minimize2,
  FileImage,
  Stamp,
  ShieldCheck,
  Eye,
  Sparkles,
  BookOpen,
  ChevronDown,
  Menu,
  X,
  FileSignature,
  Bot,
  Eraser,
  Crown,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export const Navbar = () => {
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tools = [
    {
      category: "Adobe Reader Pro",
      items: [
        { name: "PDF Reader & Annotator", href: "/reader", icon: BookOpen, desc: "Multi-mode viewer, Pen, Marker, Notes" },
        { name: "Sign & Stamp Studio", href: "/reader", icon: FileSignature, desc: "Draw, Type cursive, Upload e-Signatures" },
        { name: "AI Chat & Summarizer", href: "/tools/chat-pdf", icon: Bot, desc: "Ask questions & summarize PDF with AI (Pro)" },
      ],
    },
    {
      category: "Organize & Edit",
      items: [
        { name: "Merge PDF", href: "/tools/merge", icon: Layers, desc: "Combine multiple PDFs into one" },
        { name: "Split PDF", href: "/tools/split", icon: Scissors, desc: "Extract pages or separate by range" },
        { name: "Organize Pages", href: "/tools/organize", icon: FileText, desc: "Reorder, rotate, delete pages" },
        { name: "Redact & Sanitize", href: "/tools/redact", icon: Eraser, desc: "Blackout confidential text & metadata" },
      ],
    },
    {
      category: "Convert & Security",
      items: [
        { name: "Convert Hub", href: "/tools/convert", icon: FileImage, desc: "PDF to Images/Docx, Images to PDF" },
        { name: "Compress PDF", href: "/tools/compress", icon: Minimize2, desc: "Reduce PDF file size locally" },
        { name: "Watermark & Numbers", href: "/tools/watermark", icon: Stamp, desc: "Add custom stamps & page numbers" },
        { name: "Protect & Flatten", href: "/tools/protect", icon: ShieldCheck, desc: "Encrypt and unlock documents" },
        { name: "AI OCR Extractor", href: "/tools/ocr", icon: Eye, desc: "Extract text from scanned PDFs" },
      ],
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-white/[0.08] backdrop-blur-xl bg-zinc-950/75 text-zinc-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-cyan-500 p-[1px] shadow-lg shadow-violet-600/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-zinc-950 rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-violet-400 group-hover:text-fuchsia-400 transition-colors" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
                DripPDF
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                Studio
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 hidden sm:block">Adobe + iLovePDF Suite</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link
            href="/reader"
            className="px-3.5 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl transition flex items-center space-x-2"
          >
            <BookOpen className="w-4 h-4 text-violet-400" />
            <span>PDF Reader Pro</span>
          </Link>

          {/* Tools Mega Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setToolsOpen(true)}
            onMouseLeave={() => setToolsOpen(false)}
          >
            <button
              className="px-3.5 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl transition flex items-center space-x-1.5"
              onClick={() => setToolsOpen(!toolsOpen)}
            >
              <span>All PDF Tools</span>
              <ChevronDown
                className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
                  toolsOpen ? "rotate-180 text-violet-400" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {toolsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-1/2 -translate-x-1/2 mt-2 w-[760px] p-5 rounded-2xl bg-zinc-900/95 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/80 grid grid-cols-3 gap-6 z-50 text-white"
                >
                  {tools.map((section, idx) => (
                    <div key={idx} className="space-y-3">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-violet-400 border-b border-white/5 pb-1">
                        {section.category}
                      </div>
                      <div className="space-y-1">
                        {section.items.map((tool, tIdx) => {
                          const Icon = tool.icon;
                          return (
                            <Link
                              key={tIdx}
                              href={tool.href}
                              onClick={() => setToolsOpen(false)}
                              className="group/item flex items-start space-x-3 p-2 rounded-xl hover:bg-white/5 transition"
                            >
                              <div className="w-8 h-8 rounded-lg bg-zinc-800/80 border border-white/5 flex items-center justify-center text-violet-400 group-hover/item:border-violet-500/40 group-hover/item:bg-violet-500/10 transition">
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-xs font-semibold text-zinc-200 group-hover/item:text-violet-300 transition">
                                  {tool.name}
                                </div>
                                <div className="text-[11px] text-zinc-400 line-clamp-1 leading-tight">
                                  {tool.desc}
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/tools/chat-pdf"
            className="px-3.5 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl transition flex items-center space-x-1.5"
          >
            <Bot className="w-4 h-4 text-cyan-400" />
            <span>AI Chat PDF</span>
            <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              New
            </span>
          </Link>

          <Link
            href="/tools/merge"
            className="px-3.5 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl transition"
          >
            Merge
          </Link>
          <Link
            href="/tools/convert"
            className="px-3.5 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl transition"
          >
            Convert
          </Link>
          <Link
            href="/#pricing"
            className="px-3.5 py-2 text-sm font-semibold text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition"
          >
            Pricing
          </Link>
        </nav>

        {/* Action Controls: Theme Toggle, Sign In, Open Workspace */}
        <div className="flex items-center space-x-2.5">
          <ThemeToggle />

          <Link
            href="/login"
            className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/5 border border-white/10 transition"
          >
            <User className="w-3.5 h-3.5 text-violet-400" />
            <span>Sign In</span>
          </Link>

          <Link
            href="/reader"
            className="hidden sm:inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-lg shadow-violet-600/25 border border-violet-400/30 transition transform active:scale-95"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Open Studio</span>
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-zinc-950/95 border-b border-white/10 px-4 pt-2 pb-6 space-y-4 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center space-x-2">
              <Link
                href="/reader"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 flex items-center justify-center space-x-2 p-3 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-300 font-semibold text-sm"
              >
                <BookOpen className="w-4 h-4 text-violet-400" />
                <span>Reader Pro</span>
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-zinc-900 border border-white/10 text-zinc-200 text-sm font-semibold flex items-center space-x-1"
              >
                <User className="w-4 h-4 text-violet-400" />
                <span>Login</span>
              </Link>
            </div>

            {tools.map((section, idx) => (
              <div key={idx} className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-violet-400/80 px-1">
                  {section.category}
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {section.items.map((tool, tIdx) => {
                    const Icon = tool.icon;
                    return (
                      <Link
                        key={tIdx}
                        href={tool.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center space-x-3 p-2.5 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-white/5"
                      >
                        <Icon className="w-4 h-4 text-violet-400" />
                        <span>{tool.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
