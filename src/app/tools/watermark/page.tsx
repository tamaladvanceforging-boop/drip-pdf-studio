"use client";
import React, { useState } from "react";
import { ToolHeader } from "@/components/tools/ToolHeader";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { addWatermark, addPageNumbers } from "@/lib/pdf-engine/security";
import { downloadUint8Array } from "@/lib/utils";
import { Stamp, Hash, Download, Loader2, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

export default function WatermarkPage() {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<"watermark" | "pagenumber">("watermark");
  const [watermarkText, setWatermarkText] = useState<string>("CONFIDENTIAL");
  const [opacity, setOpacity] = useState<number>(0.25);
  const [rotation, setRotation] = useState<number>(45);
  const [fontSize, setFontSize] = useState<number>(48);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Page numbering options
  const [pageFormat, setPageFormat] = useState<"page_of_total" | "number">("page_of_total");
  const [pagePosition, setPagePosition] = useState<"bottom-center" | "bottom-right" | "top-center" | "top-right">("bottom-center");

  const handleApply = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const buffer = await file.arrayBuffer();
      if (mode === "watermark") {
        const watermarked = await addWatermark(buffer, {
          text: watermarkText,
          opacity,
          rotation,
          size: fontSize,
        });
        downloadUint8Array(watermarked, `watermarked_${file.name}`, "application/pdf");
      } else {
        const numbered = await addPageNumbers(buffer, {
          format: pageFormat,
          position: pagePosition,
        });
        downloadUint8Array(numbered, `numbered_${file.name}`, "application/pdf");
      }
      confetti({ particleCount: 80, spread: 60 });
    } catch (err) {
      console.error("Failed to process watermark/page numbers:", err);
      alert("Failed to process document.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full space-y-8">
      <ToolHeader
        icon={Stamp}
        title="Watermark & Page Numbering"
        description="Stamp custom semi-transparent watermarks or embed clean sequential page numbers onto your PDF."
      />

      <FileDropzone
        multiple={false}
        onFilesSelected={(files) => setFile(files[0] || null)}
        title="Drop a PDF file to watermark or number"
        description="Configure watermark text or header/footer page numbering below."
      />

      {file && (
        <div className="bg-zinc-900/60 p-6 rounded-2xl border border-white/10 space-y-6 backdrop-blur-xl">
          {/* Mode Switcher */}
          <div className="flex border-b border-white/10 pb-4">
            <button
              onClick={() => setMode("watermark")}
              className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center justify-center space-x-1.5 ${
                mode === "watermark"
                  ? "bg-violet-600/30 text-violet-300 border border-violet-500/40"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Stamp className="w-3.5 h-3.5" />
              <span>Text Watermark</span>
            </button>
            <button
              onClick={() => setMode("pagenumber")}
              className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center justify-center space-x-1.5 ${
                mode === "pagenumber"
                  ? "bg-violet-600/30 text-violet-300 border border-violet-500/40"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Hash className="w-3.5 h-3.5" />
              <span>Page Numbers</span>
            </button>
          </div>

          {mode === "watermark" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-200 mb-1">
                  Watermark Text:
                </label>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder="e.g. CONFIDENTIAL / DRAFT / DO NOT COPY"
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-violet-500 text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">
                    Opacity: {Math.round(opacity * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.05"
                    max="0.8"
                    step="0.05"
                    value={opacity}
                    onChange={(e) => setOpacity(parseFloat(e.target.value))}
                    className="w-full accent-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">
                    Rotation: {rotation}°
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="90"
                    step="15"
                    value={rotation}
                    onChange={(e) => setRotation(parseInt(e.target.value, 10))}
                    className="w-full accent-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">
                    Font Size: {fontSize}px
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="80"
                    step="4"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                    className="w-full accent-violet-500"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-200 mb-1">
                    Numbering Format:
                  </label>
                  <select
                    value={pageFormat}
                    onChange={(e) => setPageFormat(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-xl text-zinc-200 text-sm focus:outline-none"
                  >
                    <option value="page_of_total">Page X of Y (e.g. Page 1 of 12)</option>
                    <option value="number">Single Number (e.g. 1, 2, 3)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-200 mb-1">
                    Position on Page:
                  </label>
                  <select
                    value={pagePosition}
                    onChange={(e) => setPagePosition(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-xl text-zinc-200 text-sm focus:outline-none"
                  >
                    <option value="bottom-center">Bottom Center (Footer)</option>
                    <option value="bottom-right">Bottom Right (Footer)</option>
                    <option value="top-center">Top Center (Header)</option>
                    <option value="top-right">Top Right (Header)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleApply}
              disabled={isProcessing}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-violet-600/30 flex items-center space-x-2 transition disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Apply & Download PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
