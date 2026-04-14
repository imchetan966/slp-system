declare module "pdfkit" {
  interface PDFDocumentOptions {
    [key: string]: unknown;
  }

  class PDFDocument {
    constructor(options?: PDFDocumentOptions);
    [key: string]: unknown;
  }
  export default PDFDocument;
}