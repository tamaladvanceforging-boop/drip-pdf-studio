import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://drippdf.studio";
  const lastModified = new Date();

  const routes = [
    "",
    "/reader",
    "/tools/merge",
    "/tools/split",
    "/tools/organize",
    "/tools/compress",
    "/tools/convert",
    "/tools/watermark",
    "/tools/protect",
    "/tools/ocr",
    "/tools/compare",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: "weekly",
    priority: route === "" ? 1.0 : 0.9,
  }));
}
