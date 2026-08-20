"use client";
import React, { useState } from "react";
import { ToolHeader } from "@/components/tools/ToolHeader";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { imagesToPdf, bundleImagesZip } from "@/lib/pdf-engine/converter";
import { downloadUint8Array, downloadBlob } from "@/lib/utils";
import { FileImage, Image as ImageIcon, FileText, Download, Loader2 } from "lucide-react";
import confetti from "canvas-confetti";

export default function ConvertHubPage() {
  const [activeTab, setActiveTab] = useState<"imgToPdf" | "pdfToImg" | "pdfToTxt">("imgToPdf");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [extractedText, setExtractedText] = useState<string>("");

  const handleImagesToPdf = async () => {
    if (selectedFiles.length === 0) return;
    setIsProcessing(true);
    try {
      const imgDataList = await Promise.all(
        selectedFiles.map(async (file) => ({
          data: await file.arrayBuffer(),
          type: file.type,
        }))
      );
      const pdfBytes = await imagesToPdf(imgDataList, "A4");
      downloadUint8Array(pdfBytes, "converted_images.pdf", "application/pdf");
      confetti({ particleCount: 80, spread: 60 });
    } catch (err) {
      console.error("Failed to convert images to PDF:", err);
      alert("Failed to convert images to PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePdfToImages = async () => {
    if (selectedFiles.length === 0) return;
    setIsProcessing(true);
    try {
      const file = selectedFiles[0];
      const buffer = await file.arrayBuffer();
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      const doc = await pdfjsLib.getDocument({ data: buffer }).promise;
      const images: { name: string; blob: Blob }[] = [];

      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          await page.render({ canvasContext: ctx, viewport }).promise;
          const blob = await new Promise<Blob | null>((res) =>
            canvas.toBlob((b) => res(b), "image/png")
          );
          if (blob) {
            images.push({ name: `page_${i}.png`, blob });
          }
        }
      }

      const zipBlob = await bundleImagesZip(images);
      downloadBlob(zipBlob, `${file.name.replace(".pdf", "")}_images.zip`);
      confetti({ particleCount: 80, spread: 60 });
    } catch (err) {
      console.error("Failed to convert PDF to images:", err);
      alert("Failed to convert PDF to images.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePdfToText = async () => {
    if (selectedFiles.length === 0) return;
    setIsProcessing(true);
    try {
      const file = selectedFiles[0];
      const buffer = await file.arrayBuffer();
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      const doc = await pdfjsLib.getDocument({ data: buffer }).promise;
      let fullText = "";

      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");
        fullText += `\n--- PAGE ${i} ---\n\n${pageText}\n`;
      }

      setExtractedText(fullText);
      confetti({ particleCount: 80, spread: 60 });
    } catch (err) {
      console.error("Failed to extract text from PDF:", err);
      alert("Failed to extract text from PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTextFile = () => {
    const blob = new Blob([extractedText], { type: "text/plain;charset=utf-8" });
    downloadBlob(blob, `${selectedFiles[0]?.name.replace(".pdf", "") || "extracted"}.txt`);
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full space-y-8">
      <ToolHeader
        icon={FileImage}
        title="Universal PDF Convert Hub"
        description="Convert photos and images into clean PDF documents, or export PDF pages as high-resolution PNG images or plain Text."
      />

      {/* Mode Switcher */}
      <div className="flex border border-white/10 rounded-2xl bg-zinc-900/60 p-1.5 max-w-lg mx-auto">
        <button
          onClick={() => {
            setActiveTab("imgToPdf");
            setSelectedFiles([]);
            setExtractedText("");
          }}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center justify-center space-x-1.5 ${
            activeTab === "imgToPdf"
              ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Images ➔ PDF</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("pdfToImg");
            setSelectedFiles([]);
            setExtractedText("");
          }}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center justify-center space-x-1.5 ${
            activeTab === "pdfToImg"
              ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <FileImage className="w-3.5 h-3.5" />
          <span>PDF ➔ Images (ZIP)</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("pdfToTxt");
            setSelectedFiles([]);
            setExtractedText("");
          }}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center justify-center space-x-1.5 ${
            activeTab === "pdfToTxt"
              ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>PDF ➔ Text</span>
        </button>
      </div>

      {activeTab === "imgToPdf" && (
        <div className="space-y-6">
          <FileDropzone
            accept="image/png, image/jpeg, image/webp"
            multiple={true}
            onFilesSelected={setSelectedFiles}
            title="Drop JPG, PNG or WebP images"
            description="Images will be merged into a multi-page PDF."
          />

          {selectedFiles.length > 0 && (
            <div className="flex justify-end">
              <button
                onClick={handleImagesToPdf}
                disabled={isProcessing}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-violet-600/30 flex items-center space-x-2 transition disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Building PDF...</span>
                  </>
                ) : (
                  <>
                    <FileImage className="w-4 h-4" />
                    <span>Convert {selectedFiles.length} Images to PDF</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === "pdfToImg" && (
        <div className="space-y-6">
          <FileDropzone
            accept=".pdf"
            multiple={false}
            onFilesSelected={setSelectedFiles}
            title="Drop a PDF file to export as PNG images"
            description="Each page will be rendered in high definition and packed into a ZIP archive."
          />

          {selectedFiles.length > 0 && (
            <div className="flex justify-end">
              <button
                onClick={handlePdfToImages}
                disabled={isProcessing}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-violet-600/30 flex items-center space-x-2 transition disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Rendering PNG Pages...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download All Pages as PNG ZIP</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === "pdfToTxt" && (
        <div className="space-y-6">
          <FileDropzone
            accept=".pdf"
            multiple={false}
            onFilesSelected={(files) => {
              setSelectedFiles(files);
              setExtractedText("");
            }}
            title="Drop a PDF to extract structured text"
            description="Extracts raw text and paragraphs into editable plain text or markdown."
          />

          {selectedFiles.length > 0 && !extractedText && (
            <div className="flex justify-end">
              <button
                onClick={handlePdfToText}
                disabled={isProcessing}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-violet-600/30 flex items-center space-x-2 transition disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Extracting Text...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    <span>Extract Text from PDF</span>
                  </>
                )}
              </button>
            </div>
          )}

          {extractedText && (
            <div className="bg-zinc-900/80 p-5 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase text-zinc-300">Extracted Text Output</h4>
                <button
                  onClick={downloadTextFile}
                  className="px-3.5 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .TXT</span>
                </button>
              </div>

              <textarea
                readOnly
                value={extractedText}
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
