"use client";
import React, { useState } from "react";
import { ToolHeader } from "@/components/tools/ToolHeader";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { downloadBlob } from "@/lib/utils";
import { Eye, Sparkles, Copy, Download, Loader2, Check } from "lucide-react";
import confetti from "canvas-confetti";

export default function OcrPage() {
  const [file, setFile] = useState<File | null>(null);
  const [ocrText, setOcrText] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleRunOcr = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(10);
    setStatusText("Initializing AI OCR Engine...");
    try {
      let imageBlob: Blob | null = null;

      if (file.type.includes("pdf")) {
        setStatusText("Rendering first page of PDF for AI scanning...");
        const buffer = await file.arrayBuffer();
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

        const doc = await pdfjsLib.getDocument({ data: buffer }).promise;
        const page = await doc.getPage(1);
        const viewport = page.getViewport({ scale: 2.0 });

        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          await page.render({ canvasContext: ctx, viewport }).promise;
          imageBlob = await new Promise<Blob | null>((res) =>
            canvas.toBlob((b) => res(b), "image/png")
          );
        }
      } else {
        imageBlob = file;
      }

      if (!imageBlob) {
        throw new Error("Could not process document image.");
      }

      setStatusText("Scanning characters with Tesseract AI...");
      setProgress(40);

      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker("eng");

      const ret = await worker.recognize(imageBlob);
      setProgress(100);
      setOcrText(ret.data.text);
      await worker.terminate();

      confetti({ particleCount: 80, spread: 60 });
    } catch (err) {
      console.error("AI OCR error:", err);
      alert("Failed to perform OCR on this document.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(ocrText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([ocrText], { type: "text/plain;charset=utf-8" });
    downloadBlob(blob, `ocr_${file?.name.replace(".pdf", "") || "document"}.txt`);
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full space-y-8">
      <ToolHeader
        icon={Eye}
        title="AI OCR Optical Character Recognition"
        description="Extract selectable and searchable text from scanned PDF documents, invoices, receipts, and images using in-browser AI."
      />

      <FileDropzone
        accept=".pdf, image/png, image/jpeg, image/webp"
        multiple={false}
        onFilesSelected={(files) => {
          setFile(files[0] || null);
          setOcrText("");
        }}
        title="Drop scanned PDF or document image"
        description="Supports PDF, PNG, JPG, and WebP."
      />

      {file && (
        <div className="bg-zinc-900/60 p-6 rounded-2xl border border-white/10 space-y-6 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-zinc-300">
            <span>Selected File: <strong className="text-white">{file.name}</strong></span>
            {!ocrText && !isProcessing && (
              <button
                onClick={handleRunOcr}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-rose-600 hover:from-violet-500 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow-lg shadow-violet-600/30"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Run AI OCR</span>
              </button>
            )}
          </div>

          {isProcessing && (
            <div className="p-6 rounded-xl bg-zinc-950/80 border border-white/5 space-y-3 text-center">
              <Loader2 className="w-8 h-8 text-rose-500 animate-spin mx-auto" />
              <p className="text-xs font-semibold text-zinc-200">{statusText}</p>
              <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden max-w-md mx-auto">
                <div
                  className="bg-gradient-to-r from-violet-500 to-rose-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {ocrText && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                  <Check className="w-4 h-4" />
                  <span>AI OCR Extraction Completed</span>
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg flex items-center space-x-1 border border-white/10"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied!" : "Copy Text"}</span>
                  </button>
                  <button
                    onClick={handleDownloadTxt}
                    className="px-3.5 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg flex items-center space-x-1 shadow"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Save as .TXT</span>
                  </button>
                </div>
              </div>

              <textarea
                readOnly
                value={ocrText}
                rows={12}
                className="w-full p-4 bg-zinc-950 border border-white/10 rounded-xl font-mono text-xs text-zinc-200 focus:outline-none"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
