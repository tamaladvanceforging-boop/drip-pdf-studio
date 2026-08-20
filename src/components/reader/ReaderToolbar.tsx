"use client";
import React from "react";
import {
  MousePointer,
  Pen,
  Highlighter,
  Type,
  Square,
  Circle,
  Stamp,
  FileSignature,
  Eraser,
  ZoomIn,
  ZoomOut,
  Maximize,
  Moon,
  Sun,
  Download,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Rows,
  Layers,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export type ToolType =
  | "select"
  | "pen"
  | "highlighter"
  | "text"
  | "rectangle"
  | "circle"
  | "stamp"
  | "signature"
  | "eraser";

export type ViewLayout = "continuous" | "single" | "book";

interface ReaderToolbarProps {
  currentTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
  activeColor: string;
  onChangeColor: (color: string) => void;
  activeStrokeWidth: number;
  onChangeStrokeWidth: (width: number) => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitWidth: () => void;
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onGoToPage: (page: number) => void;
  viewLayout: ViewLayout;
  onChangeLayout: (layout: ViewLayout) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenSignatureModal: () => void;
  onOpenStampPicker: () => void;
  onExportPdf: () => void;
  onClearAnnotations: () => void;
  annotationCount: number;
  isExporting?: boolean;
}

export const ReaderToolbar: React.FC<ReaderToolbarProps> = ({
  currentTool,
  onSelectTool,
  activeColor,
  onChangeColor,
  activeStrokeWidth,
  onChangeStrokeWidth,
  zoom,
  onZoomIn,
  onZoomOut,
  onFitWidth,
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  onGoToPage,
  viewLayout,
  onChangeLayout,
  isDarkMode,
  onToggleDarkMode,
  onOpenSignatureModal,
  onOpenStampPicker,
  onExportPdf,
  onClearAnnotations,
  annotationCount,
  isExporting = false,
}) => {
  const tools: { id: ToolType; label: string; icon: any }[] = [
    { id: "select", label: "Select / Pan", icon: MousePointer },
    { id: "pen", label: "Pen Draw", icon: Pen },
    { id: "highlighter", label: "Highlight", icon: Highlighter },
    { id: "text", label: "Text Box", icon: Type },
    { id: "rectangle", label: "Rectangle", icon: Square },
    { id: "circle", label: "Circle", icon: Circle },
    { id: "eraser", label: "Eraser", icon: Eraser },
  ];

  const colors = [
    "#8b5cf6", // Violet
    "#3b82f6", // Blue
    "#10b981", // Emerald
    "#f59e0b", // Amber
    "#ef4444", // Rose
    "#000000", // Black
  ];

  return (
    <div className="w-full glass border-b border-white/10 px-3 py-2 flex flex-wrap items-center justify-between gap-3 text-xs z-30 sticky top-16 bg-zinc-950/90 backdrop-blur-xl">
      {/* Group 1: Annotation Tools */}
      <div className="flex items-center space-x-1 overflow-x-auto py-1 scrollbar-none">
        {tools.map((t) => {
          const Icon = t.icon;
          const isActive = currentTool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onSelectTool(t.id)}
              title={t.label}
              className={`p-2 rounded-xl flex items-center space-x-1 transition ${
                isActive
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30 font-semibold"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden lg:inline">{t.label}</span>
            </button>
          );
        })}

        <div className="h-5 w-[1px] bg-white/10 mx-1" />

        {/* Stamps & Signatures */}
        <button
          onClick={onOpenStampPicker}
          className="p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/5 flex items-center space-x-1.5 transition border border-white/5"
          title="Add Stamp"
        >
          <Stamp className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">Stamp</span>
        </button>

        <button
          onClick={onOpenSignatureModal}
          className="p-2 rounded-xl bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 border border-violet-500/30 flex items-center space-x-1.5 transition font-semibold"
          title="Add e-Signature"
        >
          <FileSignature className="w-4 h-4 text-violet-400" />
          <span className="hidden sm:inline">e-Sign</span>
        </button>
      </div>

      {/* Group 2: Color Palette & Stroke Width (if applicable) */}
      {(currentTool === "pen" ||
        currentTool === "highlighter" ||
        currentTool === "text" ||
        currentTool === "rectangle" ||
        currentTool === "circle") && (
        <div className="hidden sm:flex items-center space-x-2 bg-zinc-900/60 px-2.5 py-1.5 rounded-xl border border-white/5">
          <div className="flex items-center space-x-1.5">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => onChangeColor(c)}
                className={`w-4 h-4 rounded-full border transition ${
                  activeColor === c ? "scale-125 border-white shadow" : "border-transparent"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <div className="h-4 w-[1px] bg-white/10" />
          <select
            value={activeStrokeWidth}
            onChange={(e) => onChangeStrokeWidth(Number(e.target.value))}
            className="bg-transparent text-zinc-300 text-[11px] focus:outline-none cursor-pointer"
          >
            <option value={2} className="bg-zinc-900">2px</option>
            <option value={4} className="bg-zinc-900">4px</option>
            <option value={8} className="bg-zinc-900">8px</option>
            <option value={14} className="bg-zinc-900">14px</option>
          </select>
        </div>
      )}

      {/* Group 3: Page Navigation & Zoom */}
      <div className="flex items-center space-x-2">
        {/* Page Nav */}
        <div className="flex items-center space-x-1 bg-zinc-900/60 px-2 py-1 rounded-xl border border-white/5">
          <button
            onClick={onPrevPage}
            disabled={currentPage <= 1}
            className="p-1 text-zinc-400 hover:text-white disabled:opacity-30"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-zinc-300 font-medium px-1">
            {currentPage} / {totalPages || 1}
          </span>
          <button
            onClick={onNextPage}
            disabled={currentPage >= totalPages}
            className="p-1 text-zinc-400 hover:text-white disabled:opacity-30"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center space-x-1 bg-zinc-900/60 px-2 py-1 rounded-xl border border-white/5">
          <button
            onClick={onZoomOut}
            className="p-1 text-zinc-400 hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-zinc-300 font-mono w-10 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={onZoomIn}
            className="p-1 text-zinc-400 hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onFitWidth}
            className="p-1 text-zinc-400 hover:text-white"
            title="Fit Width"
          >
            <Maximize className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Layout Modes */}
        <div className="hidden md:flex items-center space-x-1 bg-zinc-900/60 p-1 rounded-xl border border-white/5">
          <button
            onClick={() => onChangeLayout("continuous")}
            className={`p-1.5 rounded-lg transition ${
              viewLayout === "continuous" ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-white"
            }`}
            title="Continuous Scroll View"
          >
            <Rows className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onChangeLayout("single")}
            className={`p-1.5 rounded-lg transition ${
              viewLayout === "single" ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-white"
            }`}
            title="Single Page View"
          >
            <BookOpen className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dark Mode toggle */}
        <button
          onClick={onToggleDarkMode}
          className={`p-2 rounded-xl border transition ${
            isDarkMode
              ? "bg-violet-600/20 text-violet-300 border-violet-500/40"
              : "bg-zinc-900/60 text-zinc-400 hover:text-white border-white/5"
          }`}
          title="Invert Reader Theme (Dark Mode)"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Clear Annotations */}
        {annotationCount > 0 && (
          <button
            onClick={onClearAnnotations}
            className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/5 transition"
            title={`Clear ${annotationCount} annotations`}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}

        {/* Save / Export Baked PDF */}
        <button
          onClick={onExportPdf}
          disabled={isExporting}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold uppercase tracking-wider shadow-lg shadow-violet-600/30 flex items-center space-x-1.5 transition disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{isExporting ? "Baking..." : "Save PDF"}</span>
        </button>
      </div>
    </div>
  );
};
