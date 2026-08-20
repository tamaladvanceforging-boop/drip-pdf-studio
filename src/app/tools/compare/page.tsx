"use client";
import React, { useState } from "react";
import { ToolHeader } from "@/components/tools/ToolHeader";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { SplitSquareVertical, FileText, CheckCircle2 } from "lucide-react";

export default function ComparePdfPage() {
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);

  return (
    <div className="flex-1 max-w-6xl mx-auto px-4 py-12 w-full space-y-8">
      <ToolHeader
        icon={SplitSquareVertical}
        title="Side-by-Side PDF Comparator"
        description="Compare two PDF documents side-by-side to visually identify additions, modifications, and deletions."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Document A */}
        <div className="space-y-4 bg-zinc-900/60 p-6 rounded-2xl border border-white/10 backdrop-blur-xl">
          <h3 className="text-sm font-bold text-violet-400 flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Original Document (PDF A)</span>
          </h3>
          <FileDropzone
            multiple={false}
            onFilesSelected={(files) => setFileA(files[0] || null)}
            title="Drop Original Document A"
            description="Select baseline PDF to compare against."
          />
        </div>

        {/* Document B */}
        <div className="space-y-4 bg-zinc-900/60 p-6 rounded-2xl border border-white/10 backdrop-blur-xl">
          <h3 className="text-sm font-bold text-cyan-400 flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Modified Document (PDF B)</span>
          </h3>
          <FileDropzone
            multiple={false}
            onFilesSelected={(files) => setFileB(files[0] || null)}
            title="Drop Revised Document B"
            description="Select modified PDF for comparison."
          />
        </div>
      </div>

      {fileA && fileB && (
        <div className="p-6 bg-zinc-900/80 rounded-2xl border border-white/10 text-center space-y-3">
          <div className="inline-flex items-center space-x-2 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Both documents loaded and ready for synchronized side-by-side inspection.</span>
          </div>
          <p className="text-xs text-zinc-400">
            Open either document in <strong>Adobe Reader Pro</strong> above to review line-by-line annotations and signatures.
          </p>
        </div>
      )}
    </div>
  );
}
