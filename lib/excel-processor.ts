// lib/excel-processor.ts
import * as XLSX from 'xlsx';

export async function processExcel(buffer: ArrayBuffer): Promise<string> {
  const workbook = XLSX.read(new Uint8Array(buffer), { type: 'array' });
  let content = '';
  
  workbook.SheetNames.forEach(sheetName => {
    const worksheet = workbook.Sheets[sheetName];
    content += XLSX.utils.sheet_to_csv(worksheet) + '\n\n';
  });
  
  return content;
}