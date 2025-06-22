// lib/word-processor.ts
import mammoth from 'mammoth';

export async function processWord(buffer: ArrayBuffer): Promise<string> {
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });
  return result.value;
}