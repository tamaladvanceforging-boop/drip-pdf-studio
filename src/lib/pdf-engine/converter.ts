import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";

/**
 * Convert multiple image files (JPG, PNG, WEBP, etc.) into a single clean PDF
 */
export async function imagesToPdf(
  imageFiles: { data: ArrayBuffer; type: string }[],
  pageSize: "A4" | "Letter" | "Fit" = "A4",
  margin = 20
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  // Page dimensions (points: 72 points per inch)
  const dimensions = {
    A4: { width: 595.28, height: 841.89 },
    Letter: { width: 612.0, height: 792.0 },
  };

  for (const imgItem of imageFiles) {
    let embeddedImage;
    if (imgItem.type.includes("png")) {
      embeddedImage = await pdfDoc.embedPng(imgItem.data);
    } else {
      // JPEG or converted JPG
      embeddedImage = await pdfDoc.embedJpg(imgItem.data);
    }

    const imgDims = embeddedImage.scale(1);

    if (pageSize === "Fit") {
      const page = pdfDoc.addPage([imgDims.width, imgDims.height]);
      page.drawImage(embeddedImage, {
        x: 0,
        y: 0,
        width: imgDims.width,
        height: imgDims.height,
      });
    } else {
      const pageDim = dimensions[pageSize];
      const page = pdfDoc.addPage([pageDim.width, pageDim.height]);

      const maxWidth = pageDim.width - margin * 2;
      const maxHeight = pageDim.height - margin * 2;

      const scale = Math.min(maxWidth / imgDims.width, maxHeight / imgDims.height, 1);
      const drawWidth = imgDims.width * scale;
      const drawHeight = imgDims.height * scale;

      const x = (pageDim.width - drawWidth) / 2;
      const y = (pageDim.height - drawHeight) / 2;

      page.drawImage(embeddedImage, {
        x,
        y,
        width: drawWidth,
        height: drawHeight,
      });
    }
  }

  return await pdfDoc.save();
}

/**
 * Convert PDF text to clean Markdown / Plain Text
 */
export function extractTextToMarkdown(pagesText: string[]): string {
  return pagesText
    .map((text, i) => `## Page ${i + 1}\n\n${text.trim()}\n`)
    .join("\n---\n\n");
}

/**
 * Create a ZIP bundle of rendered page canvases/images
 */
export async function bundleImagesZip(
  images: { name: string; blob: Blob }[]
): Promise<Blob> {
  const zip = new JSZip();
  images.forEach((img) => {
    zip.file(img.name, img.blob);
  });
  return await zip.generateAsync({ type: "blob" });
}
