import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";

export interface WatermarkOptions {
  text: string;
  color?: { r: number; g: number; b: number };
  opacity?: number;
  size?: number;
  rotation?: number; // degrees
  position?: "center" | "diagonal" | "top-right" | "bottom-right";
}

/**
 * Add custom text watermark to every page in a PDF
 */
export async function addWatermark(
  pdfBuffer: ArrayBuffer,
  options: WatermarkOptions
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const text = options.text || "CONFIDENTIAL";
  const size = options.size || 48;
  const opacity = options.opacity ?? 0.25;
  const color = options.color
    ? rgb(options.color.r / 255, options.color.g / 255, options.color.b / 255)
    : rgb(0.7, 0.2, 0.2);
  const rotation = options.rotation ?? 45;

  for (const page of pages) {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, size);
    const textHeight = font.heightAtSize(size);

    let x = (width - textWidth) / 2;
    let y = (height - textHeight) / 2;

    if (options.position === "top-right") {
      x = width - textWidth - 40;
      y = height - textHeight - 40;
    } else if (options.position === "bottom-right") {
      x = width - textWidth - 40;
      y = 40;
    }

    page.drawText(text, {
      x,
      y,
      size,
      font,
      color,
      opacity,
      rotate: degrees(rotation),
    });
  }

  return await pdfDoc.save();
}

export interface PageNumberOptions {
  format?: "number" | "page_of_total"; // "1" vs "Page 1 of 10"
  position?: "bottom-center" | "bottom-right" | "top-center" | "top-right";
  fontSize?: number;
  margin?: number;
}

/**
 * Add page numbering to all pages in a PDF
 */
export async function addPageNumbers(
  pdfBuffer: ArrayBuffer,
  options: PageNumberOptions = {}
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();
  const totalPages = pages.length;
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const fontSize = options.fontSize || 10;
  const margin = options.margin || 25;
  const format = options.format || "page_of_total";
  const position = options.position || "bottom-center";

  pages.forEach((page, index) => {
    const { width, height } = page.getSize();
    const pageNum = index + 1;
    const label =
      format === "page_of_total"
        ? `Page ${pageNum} of ${totalPages}`
        : `${pageNum}`;

    const textWidth = font.widthOfTextAtSize(label, fontSize);

    let x = (width - textWidth) / 2;
    let y = margin;

    if (position === "bottom-right") {
      x = width - textWidth - margin;
      y = margin;
    } else if (position === "top-center") {
      x = (width - textWidth) / 2;
      y = height - margin - fontSize;
    } else if (position === "top-right") {
      x = width - textWidth - margin;
      y = height - margin - fontSize;
    }

    page.drawText(label, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(0.3, 0.3, 0.3),
    });
  });

  return await pdfDoc.save();
}

/**
 * Flatten all annotations and form fields in a PDF
 */
export async function flattenPdf(pdfBuffer: ArrayBuffer): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
  const form = pdfDoc.getForm();
  try {
    form.flatten();
  } catch (e) {
    // If no form exists, continue
  }
  return await pdfDoc.save();
}
