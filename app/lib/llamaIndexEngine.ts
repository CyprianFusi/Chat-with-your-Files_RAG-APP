import { Document, VectorStoreIndex } from 'llamaindex';

/**
 * Builds a LlamaIndex QueryEngine from a plain text document.
 */
export async function createQueryEngine(documentText: string) {
  const doc = new Document({ text: documentText });
  const index = await VectorStoreIndex.fromDocuments([doc]);
  return index.asQueryEngine();
}
