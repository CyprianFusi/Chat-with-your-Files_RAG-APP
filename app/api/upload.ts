// pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import pdfParse from 'pdf-parse';

let uploadedText: string = '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const auth = req.headers.authorization;
  const sessionId = req.headers['x-session-id'];

  if (!auth?.startsWith('Bearer ') || !sessionId) {
    return res.status(401).json({ error: 'Missing API key or session ID' });
  }

  // FIX: Use Uint8Array instead of Buffer for chunks
  const buffer = await new Promise<Buffer>((resolve, reject) => {
    const chunks: Uint8Array[] = []; // Changed to Uint8Array
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });

  try {
    const parsed = await pdfParse(buffer);
    uploadedText = parsed.text;
    const tokens = parsed.text.split(/\s+/).length;
    return res.status(200).json({ tokens });
  } catch (err: any) {
    console.error('[UPLOAD ERROR]', err.message || err);
    return res.status(500).json({ error: 'Upload failed' });
  }
}