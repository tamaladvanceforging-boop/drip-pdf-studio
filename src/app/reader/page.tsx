"use client";
import React, { useState, useEffect } from "react";
import {
  ReaderToolbar,
  ToolType,
  ViewLayout,
} from "@/components/reader/ReaderToolbar";
import { PdfViewer } from "@/components/reader/PdfViewer";
import { SignatureModal } from "@/components/reader/SignatureModal";
import { StampPicker } from "@/components/reader/StampPicker";
import { AnnotationItem, bakeAnnotations } from "@/lib/pdf-engine/annotator";
import { downloadUint8Array } from "@/lib/utils";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import confetti from "canvas-confetti";
import { Sparkles, FilePlus2, UploadCloud, BookOpen } from "lucide-react";

export default function ReaderPage() {
  const [fileData, setFileData] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState<string>("document.pdf");
  const [currentTool, setCurrentTool] = useState<ToolType>("select");
  const [activeColor, setActiveColor] = useState<string>("#8b5cf6");
  const [activeStrokeWidth, setActiveStrokeWidth] = useState<number>(3);
  const [zoom, setZoom] = useState<number>(1.0);
  const [viewLayout, setViewLayout] = useState<ViewLayout>("continuous");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [annotations, setAnnotations] = useState<AnnotationItem[]>([]);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Modal triggers
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState<boolean>(false);
  const [isStampPickerOpen, setIsStampPickerOpen] = useState<boolean>(false);
  const [activeStampToAdd, setActiveStampToAdd] = useState<{ label: string; color: string } | null>(null);
  const [activeSignatureToAdd, setActiveSignatureToAdd] = useState<string | null>(null);

  // Generate an interactive sample PDF if user wants to test right away
  const handleLoadSamplePdf = async () => {
    try {
      const pdfDoc = await PDFDocument.create();
      const page1 = pdfDoc.addPage([595.28, 841.89]); // A4
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

      page1.drawText("DripPDF Studio - Adobe Reader Pro Workspace", {
        x: 50,
        y: 780,
        size: 20,
        font: fontBold,
        color: rgb(0.55, 0.36, 0.96),
      });

      page1.drawText("Welcome to the Hybrid Adobe Reader + iLovePDF Suite.", {
        x: 50,
        y: 750,
        size: 12,
        font: fontRegular,
        color: rgb(0.2, 0.2, 0.2),
      });

      page1.drawText("Try the following Adobe Acrobat tools directly on this document:", {
        x: 50,
        y: 710,
        size: 11,
        font: fontBold,
        color: rgb(0.1, 0.1, 0.1),
      });

      const bullets = [
        "1. Pen Drawing & Marker Highlighting (Select Pen or Highlight from top toolbar)",
        "2. Add Text Boxes anywhere on the page (Click Text Box, then click on page)",
        "3. Digital e-Signature Studio (Click e-Sign -> Draw / Type cursive calligraphy -> Place onto page)",
        "4. Adobe Stamp Templates (Click Stamp -> Pick 'APPROVED' / 'CONFIDENTIAL' -> Place)",
        "5. Invert Dark Reading Mode & Multi-layout Zoom (Continuous & Single page view)",
        "6. Click 'Save PDF' to bake all annotations natively into the output PDF stream!",
      ];

      bullets.forEach((b, i) => {
        page1.drawText(b, {
          x: 60,
          y: 680 - i * 30,
          size: 10,
          font: fontRegular,
          color: rgb(0.25, 0.25, 0.3),
        });
      });

      // Signature line box
      page1.drawRectangle({
        x: 50,
        y: 280,
        width: 495,
        height: 140,
        borderColor: rgb(0.8, 0.8, 0.85),
        borderWidth: 1,
      });

      page1.drawText("Official Document Sign-off Area:", {
        x: 65,
        y: 395,
        size: 11,
        font: fontBold,
        color: rgb(0.3, 0.3, 0.35),
      });

      page1.drawText("Place your e-Signature or Approved Stamp inside this box.", {
        x: 65,
        y: 375,
        size: 9.5,
        font: fontRegular,
        color: rgb(0.5, 0.5, 0.55),
      });

      // Add Page 2
      const page2 = pdfDoc.addPage([595.28, 841.89]);
      page2.drawText("Page 2 - Additional Document Review Section", {
        x: 50,
        y: 780,
        size: 18,
        font: fontBold,
        color: rgb(0.2, 0.4, 0.8),
      });

      page2.drawText("Multi-page continuous scrolling and annotations work across all pages.", {
        x: 50,
        y: 745,
        size: 11,
        font: fontRegular,
        color: rgb(0.3, 0.3, 0.3),
      });

      const pdfBytes = await pdfDoc.save();
      setFileData(pdfBytes.buffer as ArrayBuffer);
      setFileName("Sample_Interactive_Document.pdf");
    } catch (err) {
      console.error("Failed to generate sample PDF:", err);
    }
  };

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setFileData(e.target.result as ArrayBuffer);
          setAnnotations([]);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleAddAnnotation = (ann: AnnotationItem) => {
    setAnnotations((prev) => [...prev, ann]);
  };

  const handleDeleteAnnotation = (id: string) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
  };

  const handleClearAnnotations = () => {
    if (confirm("Clear all drawings, text, and signatures from this document?")) {
      setAnnotations([]);
    }
  };

  // Export baked PDF
  const handleExportPdf = async () => {
    if (!fileData) return;
    setIsExporting(true);
    try {
      const bakedBytes = await bakeAnnotations(fileData, annotations);
      downloadUint8Array(
        bakedBytes,
        fileName.replace(".pdf", "_annotated.pdf"),
        "application/pdf"
      );
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error("Failed to bake annotations:", err);
      alert("Failed to export PDF annotations.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 min-h-[calc(100vh-4rem)] relative">
      {fileData ? (
        <>
          {/* Adobe Reader Pro Toolbar */}
          <ReaderToolbar
            currentTool={currentTool}
            onSelectTool={(tool) => {
              setCurrentTool(tool);
              setActiveStampToAdd(null);
              setActiveSignatureToAdd(null);
            }}
            activeColor={activeColor}
            onChangeColor={setActiveColor}
            activeStrokeWidth={activeStrokeWidth}
            onChangeStrokeWidth={setActiveStrokeWidth}
            zoom={zoom}
            onZoomIn={() => setZoom((z) => Math.min(z + 0.15, 2.5))}
            onZoomOut={() => setZoom((z) => Math.max(z - 0.15, 0.4))}
            onFitWidth={() => setZoom(1.0)}
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevPage={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            onNextPage={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            onGoToPage={setCurrentPage}
            viewLayout={viewLayout}
            onChangeLayout={setViewLayout}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            onOpenSignatureModal={() => setIsSignatureModalOpen(true)}
            onOpenStampPicker={() => setIsStampPickerOpen(true)}
            onExportPdf={handleExportPdf}
            onClearAnnotations={handleClearAnnotations}
            annotationCount={annotations.length}
            isExporting={isExporting}
          />

          {/* Interactive PDF Canvas Viewer */}
          <PdfViewer
            fileData={fileData}
            currentTool={currentTool}
            activeColor={activeColor}
            activeStrokeWidth={activeStrokeWidth}
            zoom={zoom}
            viewLayout={viewLayout}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onTotalPagesLoaded={setTotalPages}
            annotations={annotations}
            onAddAnnotation={handleAddAnnotation}
            onDeleteAnnotation={handleDeleteAnnotation}
            isDarkMode={isDarkMode}
            activeStampToAdd={activeStampToAdd}
            onStampPlaced={() => setActiveStampToAdd(null)}
            activeSignatureToAdd={activeSignatureToAdd}
            onSignaturePlaced={() => setActiveSignatureToAdd(null)}
          />
        </>
      ) : (
        /* Empty State: File Dropzone & Sample Generator */
        <div className="flex-1 max-w-4xl mx-auto px-4 py-12 flex flex-col items-center justify-center space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Adobe Reader Pro Workspace</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Open or Create a PDF Document
            </h1>
            <p className="text-sm text-zinc-400 max-w-md mx-auto">
              Select any PDF file from your device, or load an interactive sample PDF to test annotation & e-signing features.
            </p>
          </div>

          <div className="w-full max-w-xl">
            <FileDropzone
              onFilesSelected={handleFilesSelected}
              title="Drop your PDF to read & annotate"
              description="Supports multi-page viewing, pen markup, highlights, and digital signatures."
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="h-[1px] w-16 bg-white/10" />
            <span className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">or</span>
            <div className="h-[1px] w-16 bg-white/10" />
          </div>

          <button
            onClick={handleLoadSamplePdf}
            className="px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-violet-500/30 hover:border-violet-500/60 text-violet-300 font-semibold text-xs uppercase tracking-wider flex items-center space-x-2 shadow-lg transition"
          >
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span>Load Interactive Sample Document</span>
          </button>
        </div>
      )}

      {/* Signature Studio Modal */}
      <SignatureModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        onSaveSignature={(dataUrl) => {
          setActiveSignatureToAdd(dataUrl);
          setCurrentTool("select");
        }}
      />

      {/* Adobe Stamp Picker Modal */}
      <StampPicker
        isOpen={isStampPickerOpen}
        onClose={() => setIsStampPickerOpen(false)}
        onSelectStamp={(label, color) => {
          setActiveStampToAdd({ label, color });
          setCurrentTool("select");
        }}
      />
    </div>
  );
}
