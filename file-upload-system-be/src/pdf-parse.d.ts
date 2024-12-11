declare module 'pdf-parse' {
  interface PdfParseResult {
    text: string;
    // Add other properties if needed
  }

  function pdfParse(buffer: Buffer): Promise<PdfParseResult>;

  export = pdfParse;
}
