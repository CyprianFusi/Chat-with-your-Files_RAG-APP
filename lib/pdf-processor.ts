// lib/pdf-processor.ts
import { getDocument } from 'pdfjs-dist';

export async function processPDF(buffer: ArrayBuffer): Promise<string> {
  const pdf = await getDocument({ data: new Uint8Array(buffer) }).promise;
  let content = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    content += textContent.items.map((item: any) => item.str).join(' ') + '\n';
  }
  
  return content;
}

