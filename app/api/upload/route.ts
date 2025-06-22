
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { VectorStoreIndex, Document, storageContextFromDefaults, Settings } from 'llamaindex';
import { OpenAIEmbedding, OpenAI } from '@llamaindex/openai';
import mammoth from 'mammoth';
import { parse as csvParse } from 'csv-parse/sync';
import * as XLSX from 'exceljs';
import pdf from 'pdf-parse';
import { promises as fs } from 'fs';
import { encoding_for_model } from 'tiktoken';

// ----- File parsers -----
function parseTxt(buffer: Buffer): string {
  return buffer.toString('utf-8');
}

async function parseDocx(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

function parseCsv(buffer: Buffer): string {
  const records = csvParse(buffer.toString('utf-8'));
  return records.map((row: string[]) => row.join(', ')).join('\n');
}

async function parsePdf(buffer: Buffer): Promise<string> {
  const result = await pdf(buffer);
  return result.text;
}

async function parseXlsx(buffer: Buffer): Promise<string> {
  const workbook = new XLSX.Workbook();
  await workbook.xlsx.load(buffer as any);
  let text = '';
  workbook.eachSheet((sheet) => {
    sheet.eachRow((row) => {
      const values = Array.isArray(row.values) ? row.values.slice(1) : [];
      const rowText = values
        .map((v) => (typeof v === 'string' || typeof v === 'number' ? v : ''))
        .join(', ');
      text += rowText + '\n';
    });
  });
  return text;
}

// ----- POST Handler -----
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('file') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    let combinedText = '';
    const fileNames: string[] = [];

    for (const file of files) {
      const fileName = file.name;
      const ext = path.extname(fileName).toLowerCase();
      const buffer = Buffer.from(await file.arrayBuffer());
      let content = '';

      if (ext === '.txt') {
        content = parseTxt(buffer);
      } else if (ext === '.docx') {
        content = await parseDocx(buffer);
      } else if (ext === '.csv') {
        content = parseCsv(buffer);
      } else if (ext === '.xlsx') {
        content = await parseXlsx(buffer);
      } else if (ext === '.pdf') {
        content = await parsePdf(buffer);
      } else {
        return NextResponse.json({ error: `Unsupported file format: ${ext}` }, { status: 400 });
      }

      // Add file separator with actual file name
      combinedText += `\n\n===== ${fileName} =====\n\n${content}`;
      fileNames.push(fileName);
    }

    const doc = new Document({
      text: combinedText,
      metadata: { files: fileNames },
    });

    // MUST SET EMBEDDING MODEL BEFORE CREATING INDEX
    Settings.embedModel = new OpenAIEmbedding();

    const persistDir = path.join(process.cwd(), 'vector-store');
    
    // Clear vector store
    try {
      await fs.rm(persistDir, { recursive: true, force: true });
    } catch {
      console.log('No existing vector store to clear');
    }

    const storageContext = await storageContextFromDefaults({ persistDir });
    await VectorStoreIndex.fromDocuments([doc], { storageContext });
    
    // Count tokens
    const encoding = encoding_for_model("gpt-3.5-turbo");
    const tokenCount = encoding.encode(combinedText).length;
    encoding.free();

    return NextResponse.json({
      status: 'success',
      files: fileNames,
      tokenCount: tokenCount
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload and index file.' }, { status: 500 });
  }
}


