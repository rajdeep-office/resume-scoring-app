// @ts-ignore
import mammoth from 'mammoth';
// @ts-ignore
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export class FileProcessor {
  static async processFile(file: File): Promise<string> {
    const fileType = file.type;
    
    if (fileType === 'application/pdf') {
      return await this.processPDF(file);
    } else if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileType === 'application/msword'
    ) {
      return await this.processWord(file);
    } else if (fileType.startsWith('text/')) {
      return await this.processText(file);
    } else {
      throw new Error('Unsupported file type. Please upload a PDF, Word document, or text file.');
    }
  }

  private static async processPDF(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }

      return fullText.trim();
    } catch (error) {
      console.error('Error processing PDF:', error);
      throw new Error('Failed to process PDF file. Please try again or use a different format.');
    }
  }

  private static async processWord(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value.trim();
    } catch (error) {
      console.error('Error processing Word document:', error);
      throw new Error('Failed to process Word document. Please try again or use a different format.');
    }
  }

  private static async processText(file: File): Promise<string> {
    try {
      const text = await file.text();
      return text.trim();
    } catch (error) {
      console.error('Error processing text file:', error);
      throw new Error('Failed to process text file. Please try again.');
    }
  }

  static validateFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain'
    ];

    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 10MB' };
    }

    if (!allowedTypes.includes(file.type)) {
      return { 
        valid: false, 
        error: 'File type not supported. Please upload a PDF, Word document, or text file.' 
      };
    }

    return { valid: true };
  }
}