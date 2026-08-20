"use client";
import React, { useState, useEffect } from "react";
import { ToolHeader } from "@/components/tools/ToolHeader";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { organizePdfPages, PageConfig } from "@/lib/pdf-engine/organizer";
import { downloadUint8Array } from "@/lib/utils";
import { Sliders, RotateCw, Trash2, ArrowLeft, ArrowRight, Download, Loader2 } from "lucide-react";
import confetti from "canvas-confetti";

interface PageThumbItem {
  id: string;
  originalIndex: number;
  rotation: number;
}

export default function OrganizePdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);
  const [pages, setPages] = useState<PageThumbItem[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    if (!file) return;
    const loadPdf = async () => {
      const buffer = await file.arrayBuffer();
      setFileBuffer(buffer);

      const { PDFDocument } = await import("pdf-lib");
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = pdf.getPageCount();

      const initialPages: PageThumbItem[] = Array.from({ length: count }, (_, i) => ({
        id: `page-${i}`,
        originalIndex: i,
        rotation: 0,
      }));
      setPages(initialPages);
    };

    loadPdf();
  }, [file]);

  const rotatePage = (index: number) => {
    setPages((prev) =>
      prev.map((p, i) => (i === index ? { ...p, rotation: (p.rotation + 90) % 360 } : p))
    );
  };

  const deletePage = (index: number) => {
    if (pages.length <= 1) {
      alert("A PDF must contain at least one page.");
      return;
    }
    setPages((prev) => prev.filter((_, i) => i !== index));
  };

  const moveLeft = (index: number) => {
    if (index === 0) return;
    const updated = [...pages];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setPages(updated);
  };

  const moveRight = (index: number) => {
    if (index === pages.length - 1) return;
    const updated = [...pages];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setPages(updated);
  };

  const handleSaveOrganized = async () => {
    if (!fileBuffer || pages.length === 0) return;
    setIsProcessing(true);
    try {
      const configs: PageConfig[] = pages.map((p) => ({
        originalIndex: p.originalIndex,
        rotation: p.rotation,
      }));
      const organizedBytes = await organizePdfPages(fileBuffer, configs);
      downloadUint8Array(
        organizedBytes,
        `organized_${file?.name || "document.pdf"}`,
        "application/pdf"
      );
      confetti({ particleCount: 80, spread: 60 });
    } catch (err) {
      console.error("Failed to organize pages:", err);
      alert("Failed to organize PDF pages.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex-1 max-w-5xl mx-auto px-4 py-12 w-full space-y-8">
      <ToolHeader
        icon={Sliders}
        title="Organize, Rotate & Delete Pages"
        description="Visual page manager to reorder pages, rotate sideways pages by 90°, and delete unwanted sheets."
      />

      {!file ? (
        <FileDropzone
          multiple={false}
          onFilesSelected={(files) => setFile(files[0] || null)}
          title="Drop a PDF file to organize"
          description="Visual thumbnail layout will load for reordering and rotation."
        />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-zinc-900/60 p-4 rounded-2xl border border-white/10">
            <div className="text-xs text-zinc-300">
              Editing: <strong className="text-white">{file.name}</strong> ({pages.length} pages remaining)
            </div>
            <button
              onClick={handleSaveOrganized}
              disabled={isProcessing}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-violet-600/30 flex items-center space-x-2 transition disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Save Organized PDF</span>
                </>
              )}
            </button>
          </div>

          {/* Grid of Page Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {pages.map((p, idx) => (
              <div
                key={p.id}
                className="bg-zinc-900/80 border border-white/10 hover:border-violet-500/40 rounded-xl p-3 flex flex-col items-center space-y-3 group shadow-lg"
              >
                {/* Visual Sheet Preview Box */}
                <div
                  className="w-24 h-32 bg-white rounded shadow flex flex-col items-center justify-center relative overflow-hidden transition-transform duration-300 border"
                  style={{ transform: `rotate(${p.rotation}deg)` }}
                >
                  <span className="text-zinc-900 font-extrabold text-lg select-none">
                    {p.originalIndex + 1}
                  </span>
                  <span className="text-[9px] text-zinc-500 uppercase tracking-widest mt-1 select-none">
                    Page
                  </span>
                </div>

                <div className="flex items-center justify-between w-full text-[11px] text-zinc-400">
                  <span>Slot #{idx + 1}</span>
                  {p.rotation > 0 && (
                    <span className="text-[10px] text-violet-400 font-bold">{p.rotation}°</span>
                  )}
                </div>

                {/* Controls */}
                <div className="flex items-center space-x-1 border-t border-white/5 pt-2 w-full justify-center">
                  <button
                    onClick={() => moveLeft(idx)}
                    disabled={idx === 0}
                    className="p-1 text-zinc-400 hover:text-white disabled:opacity-20"
                    title="Move Left"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => rotatePage(idx)}
                    className="p-1 text-zinc-400 hover:text-violet-400 hover:bg-white/5 rounded transition"
                    title="Rotate 90° Clockwise"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deletePage(idx)}
                    className="p-1 text-zinc-400 hover:text-rose-400 hover:bg-white/5 rounded transition"
                    title="Delete Page"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveRight(idx)}
                    disabled={idx === pages.length - 1}
                    className="p-1 text-zinc-400 hover:text-white disabled:opacity-20"
                    title="Move Right"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
