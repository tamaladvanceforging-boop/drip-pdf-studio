# DripPDF Studio - Hybrid Adobe Reader Pro & iLovePDF Suite

A complete, high-performance, **100% Client-Side** hybrid PDF workstation combining the interactive reading/annotation power of **Adobe Acrobat Reader Pro** with the versatile processing power of the **iLovePDF Suite** (20+ tools).

Built with **Next.js 16**, **React 19**, **Tailwind CSS v4**, **Aceternity UI**, **Framer Motion**, and **Three.js** 3D visuals.

---

## Key Features

### 1. Adobe Acrobat Reader Pro Engine
- **Multi-Layout Canvas Viewer**: Continuous vertical scroll, Single page slide view, 2-page book spread, and Zoom from 25% to 500%.
- **Pen & Highlighter Tool**: Freehand stylus / mouse drawing and text highlighter with adjustable stroke width and vibrant color palette.
- **Text Box & Shapes**: Place draggable text boxes, rectangles, and circles anywhere on the document.
- **Adobe Stamp Templates**: Instant stamps (`APPROVED`, `CONFIDENTIAL`, `REJECTED`, `DRAFT`, `COMPLETED`, `PAID`, `VOID`).
- **Digital e-Signature Studio**: Draw signature with touch curves, type signature in cursive calligraphy styles, or upload signature PNG.
- **Native PDF Baking**: Compiles and bakes all drawings, text, and signatures directly into the output PDF stream via `pdf-lib`.
- **Night Reading Mode**: Invert colors for comfortable reading in low light.

### 2. iLovePDF Complete Suite (20+ Tools)
- **Merge PDF**: Combine multiple PDFs into a single file with custom sequence ordering.
- **Split PDF**: Split PDF by page ranges (e.g. `1-3, 5, 8-10`) or extract every page into a ZIP archive.
- **Organize Pages**: Visual grid of all pages to rotate individual sheets by 90°, delete pages, or reorder pages.
- **Compress PDF**: Smart client-side optimization with Extreme, Recommended, and Light presets.
- **Convert Hub**:
  - Images (JPG, PNG, WebP) to PDF.
  - PDF to high-res PNG Images (packed into ZIP).
  - PDF to structured Plain Text / Markdown.
- **Watermark & Page Numbering**: Diagonal/centered text watermark with opacity and customizable header/footer numbering.
- **Protect & Flatten**: Flatten all interactive form fields and signatures permanently.
- **AI OCR Extractor**: Tesseract.js in-browser AI engine to extract copyable text from scanned PDFs and receipts.

### 3. Aceternity UI, Three.js & Framer Motion Visuals
- **Aceternity UI**: Spotlight lighting, Bento Grid, Floating Dock navigation, and Background Beams.
- **Three.js**: Interactive 3D floating document hero canvas that reacts to mouse/touch gestures.
- **Framer Motion**: Smooth page transitions, tool modals, and spring physics.
- **PWA & Offline Ready**: Installable on Windows, macOS, iOS, and Android.

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

---

## 100% Client-Side Privacy Guarantee
Your documents never leave your browser. All PDF parsing, rendering, editing, and converting are processed locally in browser memory and WebAssembly.
