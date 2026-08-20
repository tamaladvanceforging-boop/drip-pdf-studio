"use client";
import React, { useState } from "react";
import { ToolHeader } from "@/components/tools/ToolHeader";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { splitPdfByRange, extractAllPagesZip } from "@/lib/pdf-engine/organizer";
import { downloadUint8Array, downloadBlob } from "@/lib/utils";
import { Scissors, FileArchive, Download, Loader2, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

export default function SplitPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [splitMode, setSplitMode] = useState<"range" | "all">("range");
  const [rangeInput, setRangeInput] = useState<string>("1-3, 5");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleSplit = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const buffer = await file.arrayBuffer();
      if (splitMode === "range") {
        const splitBytes = await splitPdfByRange(buffer, rangeInput);
        downloadUint8Array(splitBytes, `split_${file.name}`, "application/pdf");
      } else {
        const zipBlob = await extractAllPagesZip(buffer, file.name.replace(".pdf", ""));
        downloadBlob(zipBlob, `extracted_pages_${file.name.replace(".pdf", "")}.zip`);
      }
      confetti({ particleCount: 80, spread: 60 });
    } catch (err: any) {
      console.error("Failed to split PDF:", err);
      alert(err.message || "Failed to split PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full space-y-8">
      <ToolHeader
        icon={Scissors}
        title="Split & Extract PDF Pages"
        description="Extract specific page ranges into a new PDF or download every page as individual PDF files in a ZIP archive."
      />

      <FileDropzone
        multiple={false}
        onFilesSelected={(files) => setFile(files[0] || null)}
        title="Drop a PDF file to split"
        description="Choose split by custom ranges or extract all pages."
      />

      {file && (
        <div className="bg-zinc-900/60 p-6 rounded-2xl border border-white/10 space-y-6 backdrop-blur-xl">
          <div className="flex border-b border-white/10 pb-4">
            <button
              onClick={() => setSplitMode("range")}
              className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition ${
                splitMode === "range"
                  ? "bg-violet-600/30 text-violet-300 border border-violet-500/40"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Split by Page Range
            </button>
            <button
              onClick={() => setSplitMode("all")}
              className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition ${
                splitMode === "all"
                  ? "bg-violet-600/30 text-violet-300 border border-violet-500/40"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Extract All Pages (ZIP)
            </button>
          </div>

          {splitMode === "range" ? (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-zinc-200">
                Specify Page Numbers or Ranges:
              </label>
              <input
                type="text"
                value={rangeInput}
                onChange={(e) => setRangeInput(e.target.value)}
                placeholder="e.g. 1-4, 7, 9-12"
                className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-violet-500 text-sm font-mono"
              />
              <p className="text-[11px] text-zinc-500">
                Example: <span className="text-violet-400 font-mono">1-5, 8, 11-14</span> extracts pages 1 to 5, page 8, and pages 11 to 14.
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-zinc-950/60 border border-white/5 flex items-center space-x-3 text-zinc-300 text-xs">
              <FileArchive className="w-5 h-5 text-amber-400" />
              <span>
                Every single page of <strong>{file.name}</strong> will be split into a separate PDF and bundled into a ZIP download.
              </span>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSplit}
              disabled={isProcessing}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-amber-600 hover:from-violet-500 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-violet-600/30 flex items-center space-x-2 transition disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Pages...</span>
                </>
              ) : (
                <>
                  <Scissors className="w-4 h-4" />
                  <span>{splitMode === "range" ? "Extract Range PDF" : "Download All Pages ZIP"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
