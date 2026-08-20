"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { ToolType, ViewLayout } from "./ReaderToolbar";
import { AnnotationItem } from "@/lib/pdf-engine/annotator";
import { Loader2, Trash2, Move } from "lucide-react";

interface PdfViewerProps {
  fileData: ArrayBuffer | null;
  currentTool: ToolType;
  activeColor: string;
  activeStrokeWidth: number;
  zoom: number;
  viewLayout: ViewLayout;
  currentPage: number;
  onPageChange: (page: number) => void;
  onTotalPagesLoaded: (total: number) => void;
  annotations: AnnotationItem[];
  onAddAnnotation: (ann: AnnotationItem) => void;
  onDeleteAnnotation: (id: string) => void;
  isDarkMode: boolean;
  activeStampToAdd: { label: string; color: string } | null;
  onStampPlaced: () => void;
  activeSignatureToAdd: string | null;
  onSignaturePlaced: () => void;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
  fileData,
  currentTool,
  activeColor,
  activeStrokeWidth,
  zoom,
  viewLayout,
  currentPage,
  onPageChange,
  onTotalPagesLoaded,
  annotations,
  onAddAnnotation,
  onDeleteAnnotation,
  isDarkMode,
  activeStampToAdd,
  onStampPlaced,
  activeSignatureToAdd,
  onSignaturePlaced,
}) => {
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<{ x: number; y: number }[]>([]);
  const [drawingPage, setDrawingPage] = useState<number>(0);

  // Load PDF Document via PDF.js
  useEffect(() => {
    let isCancelled = false;
    if (!fileData) return;

    const loadPdf = async () => {
      setIsLoading(true);
      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

        const loadingTask = pdfjsLib.getDocument({
          data: fileData,
          cMapUrl: "https://unpkg.com/pdfjs-dist@4.10.38/cmaps/",
          cMapPacked: true,
        });

        const doc = await loadingTask.promise;
        if (!isCancelled) {
          setPdfDoc(doc);
          setTotalPages(doc.numPages);
          onTotalPagesLoaded(doc.numPages);
        }
      } catch (err) {
        console.error("Failed to load PDF with pdfjs:", err);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    loadPdf();
    return () => {
      isCancelled = true;
    };
  }, [fileData]);

  // Page interaction handlers
  const handlePageClick = (e: React.MouseEvent<HTMLDivElement>, pageIndex: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Placing a Stamp
    if (activeStampToAdd) {
      onAddAnnotation({
        id: `stamp-${Date.now()}`,
        pageIndex,
        type: "stamp",
        x,
        y,
        stampLabel: activeStampToAdd.label,
        color: activeStampToAdd.color,
      });
      onStampPlaced();
      return;
    }

    // Placing an e-Signature
    if (activeSignatureToAdd) {
      onAddAnnotation({
        id: `sig-${Date.now()}`,
        pageIndex,
        type: "signature",
        x,
        y,
        width: 0.28,
        height: 0.12,
        signatureDataUrl: activeSignatureToAdd,
      });
      onSignaturePlaced();
      return;
    }

    // Placing Text Box
    if (currentTool === "text") {
      const text = prompt("Enter text annotation:") || "";
      if (text.trim()) {
        onAddAnnotation({
          id: `text-${Date.now()}`,
          pageIndex,
          type: "text",
          x,
          y,
          text,
          color: activeColor,
          fontSize: 16,
        });
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, pageIndex: number) => {
    if (currentTool !== "pen" && currentTool !== "highlighter") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setIsDrawing(true);
    setDrawingPage(pageIndex);
    setCurrentStroke([{ x, y }]);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, pageIndex: number) => {
    if (!isDrawing || drawingPage !== pageIndex) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setCurrentStroke((prev) => [...prev, { x, y }]);
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    if (currentStroke.length > 1) {
      onAddAnnotation({
        id: `draw-${Date.now()}`,
        pageIndex: drawingPage,
        type: currentTool === "highlighter" ? "highlighter" : "pen",
        points: currentStroke,
        color: activeColor,
        strokeWidth: currentTool === "highlighter" ? activeStrokeWidth * 3 : activeStrokeWidth,
        opacity: currentTool === "highlighter" ? 0.35 : 1,
      });
    }
    setIsDrawing(false);
    setCurrentStroke([]);
  };

  if (!fileData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-zinc-500 min-h-[500px]">
        <p className="text-sm">No PDF document loaded. Select or drop a file above to begin.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-zinc-400 min-h-[500px] space-y-3">
        <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
        <p className="text-xs font-semibold uppercase tracking-wider">Rendering PDF Document...</p>
      </div>
    );
  }

  const pagesToRender =
    viewLayout === "single"
      ? [currentPage]
      : Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div
      ref={containerRef}
      onMouseUp={handleMouseUp}
      className="flex-1 overflow-y-auto overflow-x-auto p-4 md:p-8 flex flex-col items-center space-y-8 bg-zinc-950/60 select-none min-h-[650px]"
    >
      {pagesToRender.map((pageNum) => {
        const pageIdx = pageNum - 1;
        const pageAnnotations = annotations.filter((a) => a.pageIndex === pageIdx);

        return (
          <PdfSinglePage
            key={pageNum}
            pdfDoc={pdfDoc}
            pageNumber={pageNum}
            zoom={zoom}
            isDarkMode={isDarkMode}
            annotations={pageAnnotations}
            isCurrentDrawing={isDrawing && drawingPage === pageIdx}
            currentDrawingStroke={currentStroke}
            activeTool={currentTool}
            activeColor={activeColor}
            activeStrokeWidth={activeStrokeWidth}
            onMouseDown={(e) => handleMouseDown(e, pageIdx)}
            onMouseMove={(e) => handleMouseMove(e, pageIdx)}
            onClick={(e) => handlePageClick(e, pageIdx)}
            onDeleteAnnotation={onDeleteAnnotation}
          />
        );
      })}
    </div>
  );
};

interface PdfSinglePageProps {
  pdfDoc: any;
  pageNumber: number;
  zoom: number;
  isDarkMode: boolean;
  annotations: AnnotationItem[];
  isCurrentDrawing: boolean;
  currentDrawingStroke: { x: number; y: number }[];
  activeTool: ToolType;
  activeColor: string;
  activeStrokeWidth: number;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onDeleteAnnotation: (id: string) => void;
}

const PdfSinglePage: React.FC<PdfSinglePageProps> = ({
  pdfDoc,
  pageNumber,
  zoom,
  isDarkMode,
  annotations,
  isCurrentDrawing,
  currentDrawingStroke,
  activeTool,
  activeColor,
  activeStrokeWidth,
  onMouseDown,
  onMouseMove,
  onClick,
  onDeleteAnnotation,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 595,
    height: 842,
  });

  useEffect(() => {
    let renderTask: any = null;
    if (!pdfDoc || !canvasRef.current) return;

    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(pageNumber);
        const viewport = page.getViewport({ scale: zoom * 1.5 });
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        setDimensions({ width: viewport.width, height: viewport.height });

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        renderTask = page.render({
          canvasContext: ctx,
          viewport: viewport,
        });
        await renderTask.promise;
      } catch (err: any) {
        if (err?.name !== "RenderingCancelledException") {
          console.error(`Error rendering page ${pageNumber}:`, err);
        }
      }
    };

    renderPage();

    return () => {
      if (renderTask) {
        renderTask.cancel();
      }
    };
  }, [pdfDoc, pageNumber, zoom]);

  const cursorClass =
    activeTool === "pen" || activeTool === "highlighter"
      ? "cursor-crosshair"
      : activeTool === "text"
      ? "cursor-text"
      : "cursor-default";

  return (
    <div
      className={`relative shadow-2xl rounded-lg overflow-hidden border border-white/10 ${cursorClass}`}
      style={{ width: dimensions.width, height: dimensions.height }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onClick={onClick}
    >
      {/* Underlying PDF Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block bg-white"
        style={{
          filter: isDarkMode ? "invert(0.9) hue-rotate(180deg) brightness(0.95)" : "none",
        }}
      />

      {/* SVG Interactive Overlay for Annotations */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Render Saved Pen / Highlighter Annotations */}
        {annotations
          .filter((a) => a.type === "pen" || a.type === "highlighter")
          .map((a) => {
            if (!a.points || a.points.length < 2) return null;
            const pathD = `M ${a.points.map((p) => `${p.x * 100},${p.y * 100}`).join(" L ")}`;
            return (
              <path
                key={a.id}
                d={pathD}
                stroke={a.color || "#8b5cf6"}
                strokeWidth={(a.strokeWidth || 2) * 0.25}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity={a.opacity ?? 1}
              />
            );
          })}

        {/* Render Current In-Progress Stroke */}
        {isCurrentDrawing && currentDrawingStroke.length > 1 && (
          <path
            d={`M ${currentDrawingStroke.map((p) => `${p.x * 100},${p.y * 100}`).join(" L ")}`}
            stroke={activeColor}
            strokeWidth={
              activeTool === "highlighter" ? activeStrokeWidth * 0.75 : activeStrokeWidth * 0.25
            }
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity={activeTool === "highlighter" ? 0.4 : 1}
          />
        )}
      </svg>

      {/* Render HTML elements: Text, Stamps, Signatures */}
      {annotations.map((ann) => {
        if (ann.type === "text" && ann.text) {
          return (
            <div
              key={ann.id}
              className="absolute pointer-events-auto group px-2 py-1 bg-zinc-950/80 backdrop-blur rounded border border-white/20 shadow-lg text-sm font-semibold flex items-center space-x-1"
              style={{
                left: `${(ann.x || 0) * 100}%`,
                top: `${(ann.y || 0) * 100}%`,
                color: ann.color || "#ffffff",
              }}
            >
              <span>{ann.text}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteAnnotation(ann.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-0.5 text-zinc-400 hover:text-rose-400 transition"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          );
        }

        if (ann.type === "stamp" && ann.stampLabel) {
          return (
            <div
              key={ann.id}
              className="absolute pointer-events-auto group px-3 py-1.5 rounded-lg border-2 border-dashed shadow-2xl -rotate-6 backdrop-blur flex items-center space-x-2"
              style={{
                left: `${(ann.x || 0.1) * 100}%`,
                top: `${(ann.y || 0.1) * 100}%`,
                borderColor: ann.color || "#10b981",
                backgroundColor: "rgba(0,0,0,0.6)",
              }}
            >
              <span
                className="text-xs font-black tracking-widest uppercase"
                style={{ color: ann.color || "#10b981" }}
              >
                {ann.stampLabel}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteAnnotation(ann.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-0.5 text-zinc-400 hover:text-rose-400 transition"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          );
        }

        if (ann.type === "signature" && ann.signatureDataUrl) {
          return (
            <div
              key={ann.id}
              className="absolute pointer-events-auto group border border-dashed border-violet-500/50 rounded-lg p-1 bg-black/40 backdrop-blur shadow-2xl"
              style={{
                left: `${(ann.x || 0.5) * 100}%`,
                top: `${(ann.y || 0.5) * 100}%`,
                width: `${(ann.width || 0.28) * 100}%`,
              }}
            >
              <img
                src={ann.signatureDataUrl}
                alt="e-Signature"
                className="w-full h-auto pointer-events-none select-none"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteAnnotation(ann.id);
                }}
                className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 p-1 bg-rose-600 text-white rounded-full shadow-lg transition"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          );
        }

        return null;
      })}

      {/* Page Number Badge */}
      <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 backdrop-blur rounded text-[10px] text-zinc-400 pointer-events-none">
        Page {pageNumber}
      </div>
    </div>
  );
};
