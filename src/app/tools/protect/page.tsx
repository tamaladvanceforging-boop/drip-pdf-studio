"use client";
import React, { useState } from "react";
import { ToolHeader } from "@/components/tools/ToolHeader";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { flattenPdf } from "@/lib/pdf-engine/security";
import { downloadUint8Array } from "@/lib/utils";
import { ShieldCheck, Layers, Download, Loader2 } from "lucide-react";
import confetti from "canvas-confetti";

export default function ProtectPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleFlatten = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const buffer = await file.arrayBuffer();
      const flattenedBytes = await flattenPdf(buffer);
      downloadUint8Array(flattenedBytes, `flattened_${file.name}`, "application/pdf");
      confetti({ particleCount: 80, spread: 60 });
    } catch (err) {
      console.error("Failed to flatten PDF:", err);
      alert("Failed to process PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full space-y-8">
      <ToolHeader
        icon={ShieldCheck}
        title="Flatten & Secure PDF Form Fields"
        description="Permanently lock form fields, digital signatures, and interactive annotations into non-editable vector graphics."
      />

      <FileDropzone
        multiple={false}
        onFilesSelected={(files) => setFile(files[0] || null)}
        title="Drop a PDF file to flatten"
        description="Locks all fillable text boxes, radio buttons, and checkboxes permanently."
      />

      {file && (
        <div className="bg-zinc-900/60 p-6 rounded-2xl border border-white/10 space-y-6 backdrop-blur-xl">
          <div className="flex items-center space-x-3 p-4 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs">
            <ShieldCheck className="w-6 h-6 flex-shrink-0" />
            <p>
              Flattening converts all fillable form inputs, signature containers, and annotations in <strong>{file.name}</strong> into permanent standard PDF page elements. They can no longer be tampered with or modified.
            </p>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleFlatten}
              disabled={isProcessing}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-teal-600 hover:from-violet-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-violet-600/30 flex items-center space-x-2 transition disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Flattening Fields...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Flatten & Secure PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
