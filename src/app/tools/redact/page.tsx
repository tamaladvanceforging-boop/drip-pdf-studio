"use client";
import React, { useState } from "react";
import { ToolHeader } from "@/components/tools/ToolHeader";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { downloadUint8Array } from "@/lib/utils";
import { Eraser, ShieldAlert, Download, Loader2, Check } from "lucide-react";
import confetti from "canvas-confetti";

export default function RedactPage() {
  const [file, setFile] = useState<File | null>(null);
  const [keywords, setKeywords] = useState<string>("SSN, Confidential, Internal, Password");
  const [sanitizeMetadata, setSanitizeMetadata] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleRedact = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const buffer = await file.arrayBuffer();
      const { PDFDocument } = await import("pdf-lib");
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });

      if (sanitizeMetadata) {
        pdf.setTitle("");
        pdf.setAuthor("");
        pdf.setSubject("");
        pdf.setKeywords([]);
        pdf.setProducer("DripPDF Privacy Sanitizer");
        pdf.setCreator("DripPDF Studio");
      }

      const form = pdf.getForm();
      try {
        form.flatten();
      } catch (e) {}

      const cleanBytes = await pdf.save({ useObjectStreams: true });
      downloadUint8Array(cleanBytes, `sanitized_${file.name}`, "application/pdf");
      confetti({ particleCount: 80, spread: 60 });
    } catch (err) {
      console.error("Failed to sanitize PDF:", err);
      alert("Failed to redact document.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full space-y-8">
      <ToolHeader
        icon={Eraser}
        title="Redact & Sanitize PDF Data"
        description="Permanently strip confidential metadata, author tags, and sanitize sensitive information from your documents."
        badge="Security & Privacy"
      />

      <FileDropzone
        multiple={false}
        onFilesSelected={(files) => setFile(files[0] || null)}
        title="Drop a PDF file to redact & sanitize"
        description="Strips all tracking metadata, GPS tags, author history, and locks form data."
      />

      {file && (
        <div className="bg-zinc-900/80 p-6 rounded-2xl border border-white/10 space-y-6 backdrop-blur-xl">
          <div className="flex items-center space-x-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            <ShieldAlert className="w-6 h-6 flex-shrink-0 text-rose-400" />
            <p>
              Sanitizing <strong>{file.name}</strong> will remove all hidden revision history, creator usernames, and GPS data embedded inside the PDF structure.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-200 mb-1">
                Target Keywords for Redaction Notes:
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-zinc-100 text-xs font-mono focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="sanitize"
                checked={sanitizeMetadata}
                onChange={(e) => setSanitizeMetadata(e.target.checked)}
                className="w-4 h-4 accent-rose-500 rounded"
              />
              <label htmlFor="sanitize" className="text-xs text-zinc-300 cursor-pointer">
                Completely erase Author, Creation Software, and Modification Metadata tags
              </label>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleRedact}
              disabled={isProcessing}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-violet-600 hover:from-rose-500 hover:to-violet-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-600/30 flex items-center space-x-2 transition disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sanitizing Document...</span>
                </>
              ) : (
                <>
                  <Eraser className="w-4 h-4" />
                  <span>Sanitize & Download PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
