import { VectorStoreIndex, storageContextFromDefaults, Document } from 'llamaindex';
import path from 'path';
import fs from 'fs';

export async function loadIndex() {
  const STORAGE_DIR = path.resolve(process.cwd(), 'storage');
  const DATA_DIR = path.resolve(process.cwd(), 'data');
  
  // Create directories if missing
  if (!fs.existsSync(STORAGE_DIR)) fs.mkdirSync(STORAGE_DIR, { recursive: true });
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

  const storageContext = await storageContextFromDefaults({ persistDir: STORAGE_DIR });

  // Check if index exists
  if (fs.existsSync(path.join(STORAGE_DIR, 'vector_store.json'))) {
    return await VectorStoreIndex.init({ storageContext });
  }

  // Create new index from documents
  const files = fs.readdirSync(DATA_DIR);
  const documents = files.map(file => {
    const filePath = path.join(DATA_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    return new Document({ text: content, id_: filePath });
  });

  return await VectorStoreIndex.fromDocuments(documents, { storageContext });
}
