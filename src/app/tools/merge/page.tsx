"use client";
import React, { useState } from "react";
import { ToolHeader } from "@/components/tools/ToolHeader";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { mergePdfs } from "@/lib/pdf-engine/organizer";
import { downloadUint8Array, formatBytes } from "@/lib/utils";
import { Layers, ArrowUpDown, Trash2, Download, CheckCircle, Loader2 } from "lucide-react";
import confetti from "canvas-confetti";

export default function MergePdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...files];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setFiles(updated);
  };

  const moveDown = (index: number) => {
    if (index === files.length - 1) return;
    const updated = [...files];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setFiles(updated);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleMerge = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);
    try {
      const buffers = await Promise.all(
        files.map((file) => file.arrayBuffer())
      );
      const mergedBytes = await mergePdfs(buffers);
      downloadUint8Array(mergedBytes, "merged_document.pdf", "application/pdf");
      setSuccess(true);
      confetti({ particleCount: 80, spread: 60 });
    } catch (err) {
      console.error("Failed to merge PDFs:", err);
      alert("Failed to merge the selected PDFs.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full space-y-8">
      <ToolHeader
        icon={Layers}
        title="Merge PDF Documents"
        description="Combine multiple PDF files into a single consolidated document in your exact specified sequence."
      />

      <FileDropzone
        multiple={true}
        onFilesSelected={(newFiles) => {
          setFiles(newFiles);
          setSuccess(false);
        }}
        title="Drop multiple PDF files to merge"
        description="Arrange files in order below and merge with one click."
      />

      {files.length > 0 && (
        <div className="space-y-4 bg-zinc-900/60 p-6 rounded-2xl border border-white/10 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-200">
              Merge Sequence ({files.length} documents)
            </h3>
            <span className="text-xs text-zinc-500">
              Total Size: {formatBytes(files.reduce((a, b) => a + b.size, 0))}
            </span>
          </div>

          <div className="space-y-2">
            {files.map((file, idx) => (
              <div
                key={`${file.name}-${idx}`}
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/80 border border-white/5"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 rounded-md bg-violet-600/30 text-violet-300 text-xs font-bold flex items-center justify-center border border-violet-500/30">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="text-xs font-medium text-zinc-200">{file.name}</p>
                    <p className="text-[10px] text-zinc-500">{formatBytes(file.size)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-20 rounded-md hover:bg-white/5"
                    title="Move Up"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => moveDown(idx)}
                    disabled={idx === files.length - 1}
                    className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-20 rounded-md hover:bg-white/5"
                    title="Move Down"
                  >
                    ▼
                  </button>
                  <button
                    onClick={() => removeFile(idx)}
                    className="p-1.5 text-zinc-400 hover:text-rose-400 rounded-md hover:bg-rose-500/10 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleMerge}
              disabled={files.length < 2 || isProcessing}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-violet-600/30 flex items-center space-x-2 transition disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Merging PDFs...</span>
                </>
              ) : (
                <>
                  <Layers className="w-4 h-4" />
                  <span>Merge {files.length} PDFs Now</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
