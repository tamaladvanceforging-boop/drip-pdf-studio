import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/app/providers";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://drippdf.studio"),
  title: {
    default: "DripPDF Studio - Free 100% Client-Side Adobe Reader Pro & iLovePDF Suite",
    template: "%s | DripPDF Studio",
  },
  description:
    "The ultimate 100% Free & Private PDF Powerhouse. Full Adobe Acrobat Reader Pro interactive markup, e-signatures, stamps, and all 20+ iLovePDF tools with zero server uploads.",
  keywords: [
    "Free PDF Editor",
    "Adobe Acrobat Alternative",
    "iLovePDF Alternative",
    "Merge PDF Online Free",
    "Split PDF",
    "Sign PDF Online Free",
    "Digital e-Signature",
    "AI OCR PDF",
    "Compress PDF",
    "Convert PDF to JPG",
    "Images to PDF",
    "Watermark PDF",
    "Organize PDF pages",
    "Client Side PDF",
    "Private PDF Editor",
    "Offline PDF PWA",
  ],
  authors: [{ name: "DripPDF Studio Team" }],
  creator: "DripPDF Studio",
  publisher: "DripPDF Studio",
  applicationName: "DripPDF Studio",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "DripPDF Studio - 100% Free Adobe Reader Pro & iLovePDF Suite",
    description:
      "Edit, sign, annotate, merge, split, convert, and compress PDFs with zero server uploads and 100% browser memory privacy.",
    url: "https://drippdf.studio",
    siteName: "DripPDF Studio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DripPDF Studio - Free Adobe Reader & iLovePDF Powerhouse",
    description:
      "Edit, sign, and convert PDFs 100% free with zero cloud uploads. The privacy-first Adobe Acrobat alternative.",
    creator: "@DripPDFStudio",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Rich JSON-LD Structured Data Schema for Google Rich Snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "DripPDF Studio",
        "operatingSystem": "All (Web, Windows, macOS, Linux, iOS, Android)",
        "applicationCategory": "BusinessApplication, ProductivityApplication",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
        },
        "description":
          "100% Free and Private Adobe Acrobat Reader Pro and iLovePDF Suite. Annotate, sign, merge, split, compress, convert, and perform AI OCR locally in browser memory.",
        "featureList": [
          "Interactive PDF Viewer & Annotator",
          "Digital e-Signature Studio (Draw, Type, Upload)",
          "Merge & Split PDF",
          "Client-Side PDF Compression",
          "Images to PDF and PDF to Images ZIP",
          "AI OCR Text Extractor (Tesseract.js)",
          "Watermarking and Page Numbering",
        ],
      },
      {
        "@type": "WebApplication",
        "name": "DripPDF Studio",
        "url": "https://drippdf.studio",
        "browserRequirements": "Requires JavaScript. Requires HTML5.",
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased selection:bg-violet-500 selection:text-white bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
        <Providers>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
