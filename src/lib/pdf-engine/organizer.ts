import { PDFDocument, degrees } from "pdf-lib";
import JSZip from "jszip";

/**
 * Merge multiple PDF files into one in sequential order
 */
export async function mergePdfs(pdfBuffers: ArrayBuffer[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();

  for (const buffer of pdfBuffers) {
    const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  return await mergedPdf.save();
}

/**
 * Split a PDF by page ranges (e.g. "1-3, 5, 7-9") or extract specific pages
 */
export async function splitPdfByRange(
  pdfBuffer: ArrayBuffer,
  pageRangeStr: string
): Promise<Uint8Array> {
  const srcPdf = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
  const totalPages = srcPdf.getPageCount();
  const newPdf = await PDFDocument.create();

  const selectedIndices: number[] = [];
  const parts = pageRangeStr.split(",").map((p) => p.trim());

  for (const part of parts) {
    if (part.includes("-")) {
      const [start, end] = part.split("-").map((n) => parseInt(n.trim(), 10));
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = Math.max(1, start); i <= Math.min(totalPages, end); i++) {
          if (!selectedIndices.includes(i - 1)) {
            selectedIndices.push(i - 1);
          }
        }
      }
    } else {
      const pageNum = parseInt(part, 10);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
        if (!selectedIndices.includes(pageNum - 1)) {
          selectedIndices.push(pageNum - 1);
        }
      }
    }
  }

  if (selectedIndices.length === 0) {
    throw new Error("No valid page range specified.");
  }

  const copiedPages = await newPdf.copyPages(srcPdf, selectedIndices);
  copiedPages.forEach((page) => newPdf.addPage(page));

  return await newPdf.save();
}

/**
 * Split PDF: Extract every page as a separate PDF and bundle into a ZIP
 */
export async function extractAllPagesZip(
  pdfBuffer: ArrayBuffer,
  baseFilename = "page"
): Promise<Blob> {
  const srcPdf = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
  const totalPages = srcPdf.getPageCount();
  const zip = new JSZip();

  for (let i = 0; i < totalPages; i++) {
    const singlePdf = await PDFDocument.create();
    const [copiedPage] = await singlePdf.copyPages(srcPdf, [i]);
    singlePdf.addPage(copiedPage);
    const pdfBytes = await singlePdf.save();
    zip.file(`${baseFilename}_${i + 1}.pdf`, pdfBytes);
  }

  return await zip.generateAsync({ type: "blob" });
}

/**
 * Reorder, rotate, or delete specific pages of a PDF
 */
export interface PageConfig {
  originalIndex: number; // 0-based
  rotation: number; // 0, 90, 180, 270
}

export async function organizePdfPages(
  pdfBuffer: ArrayBuffer,
  pageConfigs: PageConfig[]
): Promise<Uint8Array> {
  const srcPdf = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
  const newPdf = await PDFDocument.create();

  for (const config of pageConfigs) {
    const [copiedPage] = await newPdf.copyPages(srcPdf, [config.originalIndex]);
    if (config.rotation) {
      const currentRotation = copiedPage.getRotation().angle;
      copiedPage.setRotation(degrees((currentRotation + config.rotation) % 360));
    }
    newPdf.addPage(copiedPage);
  }

  return await newPdf.save();
}
