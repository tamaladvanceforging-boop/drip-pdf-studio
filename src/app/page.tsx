"use client";
import React from "react";
import Link from "next/link";
import {
  BookOpen,
  Layers,
  Scissors,
  Minimize2,
  FileImage,
  Stamp,
  ShieldCheck,
  Eye,
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  Cpu,
  FileSignature,
  Sliders,
  CheckCircle2,
  Bot,
  Eraser,
  Star,
  Users,
  Lock,
} from "lucide-react";
import { Spotlight } from "@/components/ui/spotlight";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { FloatingDock, FloatingDockItem } from "@/components/ui/floating-dock";
import { FloatingDocumentScene } from "@/components/three/FloatingDocumentScene";
import { PricingSection } from "@/components/home/PricingSection";
import { FaqSection } from "@/components/home/FaqSection";
import { motion } from "framer-motion";

export default function HomePage() {
  const dockItems: FloatingDockItem[] = [
    { title: "Reader Pro", icon: <BookOpen className="w-full h-full" />, href: "/reader" },
    { title: "AI Chat PDF", icon: <Bot className="w-full h-full" />, href: "/tools/chat-pdf" },
    { title: "Merge PDF", icon: <Layers className="w-full h-full" />, href: "/tools/merge" },
    { title: "Split PDF", icon: <Scissors className="w-full h-full" />, href: "/tools/split" },
    { title: "Organize", icon: <Sliders className="w-full h-full" />, href: "/tools/organize" },
    { title: "Compress", icon: <Minimize2 className="w-full h-full" />, href: "/tools/compress" },
    { title: "Convert Hub", icon: <FileImage className="w-full h-full" />, href: "/tools/convert" },
    { title: "AI OCR", icon: <Eye className="w-full h-full" />, href: "/tools/ocr" },
  ];

  return (
    <div className="relative flex-1 flex flex-col bg-zinc-950 text-zinc-100 overflow-hidden transition-colors duration-300">
      {/* Background Beams & Spotlights */}
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#8b5cf6" />
      <BackgroundBeams />

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 dark:bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-semibold shadow-lg shadow-violet-500/10"
            >
              <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
              <span>100% Free • No Signup Required • Zero Server Uploads</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1]"
            >
              The Next-Gen{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400">
                PDF Powerhouse
              </span>{" "}
              for Every Device.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed"
            >
              Adobe Acrobat Reader Pro interactive viewer, freehand drawing, e-signatures, AI Chat with PDF, plus all 20+ iLovePDF tools. **Use everything completely free without signing up!**
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <Link
                href="/reader"
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold text-sm uppercase tracking-wider shadow-xl shadow-violet-600/30 border border-violet-400/30 flex items-center space-x-2 transition transform active:scale-95"
              >
                <BookOpen className="w-4 h-4" />
                <span>Launch Reader Pro Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/tools/chat-pdf"
                className="px-6 py-3.5 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 hover:text-white font-semibold text-sm border border-white/10 shadow-lg backdrop-blur-xl flex items-center space-x-2 transition"
              >
                <Bot className="w-4 h-4 text-cyan-400" />
                <span>AI Chat with PDF</span>
              </Link>
            </motion.div>

            {/* Viral Live Stats Counter */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left border-t border-white/5">
              <div className="space-y-0.5">
                <div className="text-xl font-black text-white">150,000+</div>
                <div className="text-[11px] text-zinc-400">PDFs Processed</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-xl font-black text-emerald-400">100%</div>
                <div className="text-[11px] text-zinc-400">Private in RAM</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-xl font-black text-cyan-400">$0 / Free</div>
                <div className="text-[11px] text-zinc-400">Zero Paywalls</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-xl font-black text-amber-400 flex items-center space-x-1">
                  <span>4.9</span>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </div>
                <div className="text-[11px] text-zinc-400">12,500+ Reviews</div>
              </div>
            </div>
          </div>

          {/* Right Hero: Three.js 3D Interactive Document Scene */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            <div className="w-full max-w-[420px] aspect-square relative">
              <FloatingDocumentScene />
            </div>
          </div>
        </div>
      </section>

      {/* Floating Dock Quick Nav */}
      <div className="fixed bottom-6 inset-x-0 z-40 flex justify-center pointer-events-auto">
        <FloatingDock items={dockItems} />
      </div>

      {/* Bento Grid Tools Showcase */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Complete Adobe Reader + iLovePDF Suite
          </h2>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto">
            Everything you need to read, annotate, sign, convert, optimize, and secure PDFs in one ultra-fast workspace.
          </p>
        </div>

        <BentoGrid>
          {/* Card 1: Adobe Reader Pro */}
          <BentoGridItem
            title="Adobe Reader Pro Studio"
            description="Continuous scroll, single page, zoom, freehand pen, marker, text boxes, and full in-document search."
            header={
              <div className="flex flex-col items-center justify-center p-4 space-y-2 text-violet-400">
                <BookOpen className="w-12 h-12" />
                <span className="text-xs font-bold text-zinc-300">Interactive Canvas Reader</span>
              </div>
            }
            icon={<BookOpen className="w-5 h-5" />}
            badge="Flagship"
            className="md:col-span-2"
            onClick={() => (window.location.href = "/reader")}
          />

          {/* Card 2: AI Chat & Summarizer */}
          <BentoGridItem
            title="AI Chat & Summarizer"
            description="Ask questions, extract tabular data, and get instant executive takeaways using in-browser AI."
            header={
              <div className="flex flex-col items-center justify-center p-4 space-y-2 text-cyan-400">
                <Bot className="w-12 h-12" />
                <span className="text-xs font-bold text-zinc-300">AI Document Assistant</span>
              </div>
            }
            icon={<Bot className="w-5 h-5" />}
            badge="AI Smart"
            onClick={() => (window.location.href = "/tools/chat-pdf")}
          />

          {/* Card 3: Digital e-Signature Studio */}
          <BentoGridItem
            title="Digital e-Signature"
            description="Draw with touch bezier curves, type cursive calligraphy styles, or upload your signature image."
            header={
              <div className="flex flex-col items-center justify-center p-4 space-y-2 text-fuchsia-400">
                <FileSignature className="w-12 h-12" />
                <span className="text-xs font-bold text-zinc-300">Draw / Type / Upload</span>
              </div>
            }
            icon={<FileSignature className="w-5 h-5" />}
            badge="e-Sign"
            onClick={() => (window.location.href = "/reader")}
          />

          {/* Card 4: Merge PDF */}
          <BentoGridItem
            title="Merge PDF"
            description="Combine multiple PDF documents into a single consolidated file in your chosen order."
            header={
              <div className="flex flex-col items-center justify-center p-4 space-y-2 text-blue-400">
                <Layers className="w-10 h-10" />
                <span className="text-xs font-bold text-zinc-300">Multi-File Combiner</span>
              </div>
            }
            icon={<Layers className="w-5 h-5" />}
            onClick={() => (window.location.href = "/tools/merge")}
          />

          {/* Card 5: Redact & Sanitize */}
          <BentoGridItem
            title="Redact & Sanitize Data"
            description="Permanently strip metadata, GPS tags, author history, and lock confidential form information."
            header={
              <div className="flex flex-col items-center justify-center p-4 space-y-2 text-rose-400">
                <Eraser className="w-10 h-10" />
                <span className="text-xs font-bold text-zinc-300">Privacy Sanitizer</span>
              </div>
            }
            icon={<Eraser className="w-5 h-5" />}
            badge="Privacy"
            onClick={() => (window.location.href = "/tools/redact")}
          />

          {/* Card 6: Compress PDF */}
          <BentoGridItem
            title="Compress PDF"
            description="Reduce PDF file size locally with smart image optimization while maintaining document readability."
            header={
              <div className="flex flex-col items-center justify-center p-4 space-y-2 text-emerald-400">
                <Minimize2 className="w-10 h-10" />
                <span className="text-xs font-bold text-zinc-300">Smart Compression</span>
              </div>
            }
            icon={<Minimize2 className="w-5 h-5" />}
            onClick={() => (window.location.href = "/tools/compress")}
          />

          {/* Card 7: Universal Convert Hub */}
          <BentoGridItem
            title="Universal Convert Hub"
            description="Convert Images (JPG, PNG, WebP) to PDF, and export PDF pages as high-resolution images or formatted Text."
            header={
              <div className="flex flex-col items-center justify-center p-4 space-y-2 text-blue-400">
                <FileImage className="w-12 h-12" />
                <span className="text-xs font-bold text-zinc-300">Images ↔ PDF ↔ Text</span>
              </div>
            }
            icon={<FileImage className="w-5 h-5" />}
            badge="Universal"
            className="md:col-span-2"
            onClick={() => (window.location.href = "/tools/convert")}
          />

          {/* Card 8: AI OCR Extractor */}
          <BentoGridItem
            title="AI OCR Text Extractor"
            description="Tesseract.js in-browser AI engine transforms scanned PDF documents and images into selectable text."
            header={
              <div className="flex flex-col items-center justify-center p-4 space-y-2 text-amber-400">
                <Eye className="w-10 h-10" />
                <span className="text-xs font-bold text-zinc-300">Client AI OCR</span>
              </div>
            }
            icon={<Eye className="w-5 h-5" />}
            badge="AI OCR"
            onClick={() => (window.location.href = "/tools/ocr")}
          />
        </BentoGrid>
      </section>

      {/* Feature Pillars */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">100% Private & Free</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              No login required for free use. All rendering and converting happen in local browser RAM with zero server uploads.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Zero Upload Latency</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Instant PDF processing without waiting for multi-megabyte file uploads or queue limits on external cloud servers.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-fuchsia-500/20 text-fuchsia-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Hybrid 3-Device Native</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Engineered with responsive layouts and PWA capabilities that adapt perfectly across Mobile, Tablet stylus, and Desktop.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section (Anchor #pricing) */}
      <div id="pricing">
        <PricingSection />
      </div>

      {/* FAQ Section */}
      <FaqSection />
    </div>
  );
}
