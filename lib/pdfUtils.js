import { fromPath } from "pdf2pic";

export async function convertPdfFirstPageToBase64(filePath) {
  const options = {
    density: 120,          // image quality
    saveFilename: "page",
    savePath: "/tmp",      // works on Vercel & local
    format: "jpeg",
    width: 800,
    height: 1000,
  };

  const convert = fromPath(filePath, options);

  // Convert only first page
  const result = await convert(1, true); // `true` returns base64

  return result.base64;
}
