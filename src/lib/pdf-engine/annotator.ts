import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";

export interface AnnotationItem {
  id: string;
  pageIndex: number; // 0-based
  type: "pen" | "highlighter" | "text" | "rectangle" | "circle" | "stamp" | "signature";
  points?: { x: number; y: number }[]; // normalized 0..1 coordinates
  x?: number; // normalized 0..1
  y?: number; // normalized 0..1
  width?: number; // normalized 0..1
  height?: number; // normalized 0..1
  text?: string;
  color?: string; // hex or rgb
  strokeWidth?: number;
  opacity?: number;
  fontSize?: number;
  signatureDataUrl?: string; // base64 PNG
  stampLabel?: string;
}

function hexToRgb(hex: string) {
  let c = hex.replace("#", "");
  if (c.length === 3) {
    c = c
      .split("")
      .map((x) => x + x)
      .join("");
  }
  const num = parseInt(c, 16);
  return {
    r: ((num >> 16) & 255) / 255,
    g: ((num >> 8) & 255) / 255,
    b: (num & 255) / 255,
  };
}

/**
 * Bake interactive annotations (pen, text, stamps, signatures, shapes) into output PDF
 */
export async function bakeAnnotations(
  pdfBuffer: ArrayBuffer,
  annotations: AnnotationItem[]
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  for (const ann of annotations) {
    if (ann.pageIndex < 0 || ann.pageIndex >= pages.length) continue;
    const page = pages[ann.pageIndex];
    const { width: pWidth, height: pHeight } = page.getSize();
    const color = ann.color ? hexToRgb(ann.color) : { r: 0, g: 0, b: 0 };
    const pdfColor = rgb(color.r, color.g, color.b);
    const opacity = ann.opacity ?? 1;

    if (ann.type === "text" && ann.text) {
      const fontSize = ann.fontSize || 14;
      const x = (ann.x || 0) * pWidth;
      const y = pHeight - (ann.y || 0) * pHeight - fontSize;

      page.drawText(ann.text, {
        x,
        y,
        size: fontSize,
        font: regularFont,
        color: pdfColor,
        opacity,
      });
    } else if (ann.type === "stamp" && ann.stampLabel) {
      const x = (ann.x || 0.1) * pWidth;
      const y = pHeight - (ann.y || 0.1) * pHeight - 40;
      const stampText = ann.stampLabel.toUpperCase();
      const fontSize = 18;
      const textWidth = font.widthOfTextAtSize(stampText, fontSize);

      // Draw stamp border box
      page.drawRectangle({
        x: x - 8,
        y: y - 8,
        width: textWidth + 16,
        height: fontSize + 16,
        borderColor: pdfColor,
        borderWidth: 2,
        opacity: 0.85,
        rotate: degrees(-5),
      });

      page.drawText(stampText, {
        x,
        y,
        size: fontSize,
        font,
        color: pdfColor,
        opacity: 0.85,
        rotate: degrees(-5),
      });
    } else if (ann.type === "signature" && ann.signatureDataUrl) {
      try {
        const base64Data = ann.signatureDataUrl.split(",")[1] || ann.signatureDataUrl;
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const embeddedSig = await pdfDoc.embedPng(bytes);
        const sigWidth = (ann.width || 0.25) * pWidth;
        const sigHeight = (ann.height || 0.1) * pHeight;
        const x = (ann.x || 0.5) * pWidth;
        const y = pHeight - (ann.y || 0.5) * pHeight - sigHeight;

        page.drawImage(embeddedSig, {
          x,
          y,
          width: sigWidth,
          height: sigHeight,
          opacity: 0.95,
        });
      } catch (err) {
        console.error("Failed to embed signature:", err);
      }
    } else if (ann.type === "rectangle") {
      const x = (ann.x || 0) * pWidth;
      const y = pHeight - ((ann.y || 0) + (ann.height || 0.1)) * pHeight;
      const w = (ann.width || 0.1) * pWidth;
      const h = (ann.height || 0.1) * pHeight;

      page.drawRectangle({
        x,
        y,
        width: w,
        height: h,
        borderColor: pdfColor,
        borderWidth: ann.strokeWidth || 2,
        opacity,
      });
    } else if (ann.type === "pen" && ann.points && ann.points.length > 1) {
      // Draw connected polyline
      for (let i = 0; i < ann.points.length - 1; i++) {
        const p1 = ann.points[i];
        const p2 = ann.points[i + 1];

        const x1 = p1.x * pWidth;
        const y1 = pHeight - p1.y * pHeight;
        const x2 = p2.x * pWidth;
        const y2 = pHeight - p2.y * pHeight;

        page.drawLine({
          start: { x: x1, y: y1 },
          end: { x: x2, y: y2 },
          thickness: ann.strokeWidth || 2,
          color: pdfColor,
          opacity,
        });
      }
    }
  }

  return await pdfDoc.save();
}
