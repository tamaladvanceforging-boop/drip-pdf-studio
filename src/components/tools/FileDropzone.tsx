"use client";
import React, { useState, useRef } from "react";
import { UploadCloud, File, X, Plus, Sparkles, CheckCircle2 } from "lucide-react";
import { formatBytes } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface FileDropzoneProps {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  onFilesSelected: (files: File[]) => void;
  title?: string;
  description?: string;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  accept = ".pdf",
  multiple = false,
  maxFiles = 10,
  onFilesSelected,
  title = "Drop your PDF files here",
  description = "or click to browse from your device. 100% private, processed in browser memory.",
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (incomingFiles: FileList | null) => {
    if (!incomingFiles) return;
    const fileList = Array.from(incomingFiles);
    let updated: File[];
    if (multiple) {
      updated = [...selectedFiles, ...fileList].slice(0, maxFiles);
    } else {
      updated = [fileList[0]];
    }
    setSelectedFiles(updated);
    onFilesSelected(updated);
  };

  const removeFile = (index: number) => {
    const updated = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updated);
    onFilesSelected(updated);
  };

  return (
    <div className="w-full space-y-4">
      {/* Drop area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 md:p-12 transition-all duration-300 text-center flex flex-col items-center justify-center overflow-hidden ${
          dragOver
            ? "border-violet-400 bg-violet-500/10 scale-[1.01]"
            : "border-white/10 hover:border-violet-500/40 bg-zinc-900/40 hover:bg-zinc-900/60"
        } backdrop-blur-xl group`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        {/* Animated Glow on hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-zinc-800/90 border border-white/10 flex items-center justify-center text-violet-400 shadow-xl mb-4 group-hover:scale-110 group-hover:text-violet-300 group-hover:border-violet-500/40 transition-all duration-300">
          <UploadCloud className="w-8 h-8" />
        </div>

        <h3 className="text-lg font-bold text-zinc-100 mb-1 group-hover:text-violet-300 transition-colors">
          {title}
        </h3>
        <p className="text-xs text-zinc-400 max-w-md mb-4">{description}</p>

        <button
          type="button"
          className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/30 border border-violet-400/30 transition active:scale-95"
        >
          Select {multiple ? "Files" : "File"}
        </button>
      </div>

      {/* Selected files preview */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
            <span>Selected files ({selectedFiles.length})</span>
            {multiple && selectedFiles.length < maxFiles && (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex items-center space-x-1 text-violet-400 hover:text-violet-300"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add more</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <AnimatePresence>
              {selectedFiles.map((file, idx) => (
                <motion.div
                  key={`${file.name}-${idx}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/80 border border-white/10 shadow-lg"
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center flex-shrink-0">
                      <File className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-medium text-zinc-200 truncate">{file.name}</p>
                      <p className="text-[10px] text-zinc-500">{formatBytes(file.size)}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(idx);
                    }}
                    className="p-1 text-zinc-400 hover:text-rose-400 hover:bg-white/5 rounded-md transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};
