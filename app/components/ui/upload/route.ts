import { NextRequest, NextResponse } from 'next/server';
import { PDFReader} from 'llamaindex'; 
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

// Handle POST file upload
export async function POST(req: NextRequest) {
  try {
    // Parse the multipart/form-data request
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Read the file buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Only support PDFs for now
    if (!file.name.endsWith('.pdf')) {
      return NextResponse.json({ error: 'Only PDF files are supported' }, { status: 415 });
    }

    // Write to a temporary file for LlamaIndex PDFReader
    const tempFilePath = path.join(os.tmpdir(), `${Date.now()}-${file.name}`);
    await fs.writeFile(tempFilePath, buffer);

    // Load the file using LlamaIndex
    const reader = new PDFReader();
    const docs = await reader.loadData(tempFilePath);

    // Clean up the temp file
    await fs.unlink(tempFilePath);

    // Respond with number of documents parsed (for example)
    return NextResponse.json({
      message: 'File uploaded and parsed successfully',
      documentsParsed: docs.length,
    });
  } catch (err: any) {
    console.error('[Upload API Error]', err);
    return NextResponse.json(
      { error: 'Internal Server Error', detail: err.message },
      { status: 500 }
    );
  }
}
