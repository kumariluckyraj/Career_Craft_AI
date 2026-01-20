// lib/pdfUtils.js
export async function extractTextFromPdf(arrayBuffer) {
  if (!arrayBuffer || !(arrayBuffer instanceof ArrayBuffer)) {
    throw new Error("Invalid PDF data provided");
  }

  // Lazy require — only executed when function is called
  const pdfParse = require("pdf-parse");

  const buffer = Buffer.from(arrayBuffer);
  const data = await pdfParse(buffer);
  return data.text;
}
