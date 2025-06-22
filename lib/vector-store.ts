// lib/vector-store.ts
import { OpenAIEmbeddings } from '@langchain/openai';

// Simple in-memory storage (for demonstration only)
const documentStore: Record<string, {
  content: string;
  embeddings: number[][];
  fileName: string;
}[]> = {};

export async function saveToVectorStore(
  content: string,
  fileName: string,
  apiKey: string
): Promise<{ tokenCount: number }> {
  try {
    // Create embeddings instance
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: apiKey,
      modelName: 'text-embedding-ada-002',
    });
    
    // Split text into chunks
    const chunks = splitTextIntoChunks(content, 1000);
    const tokenCount = chunks.join('').split(/\s+/).length;
    
    // Generate embeddings for each chunk
    const vectors = await embeddings.embedDocuments(chunks);
    
    // Store in memory
    if (!documentStore[apiKey]) documentStore[apiKey] = [];
    documentStore[apiKey].push({
      content,
      embeddings: vectors,
      fileName
    });
    
    return { tokenCount };
  } catch (error) {
    console.error('Vector storage error:', error);
    throw new Error('Failed to process document');
  }
}

export async function retrieveRelevantChunks(
  query: string,
  apiKey: string
): Promise<{ content: string; fileName: string }[]> {
  if (!documentStore[apiKey] || documentStore[apiKey].length === 0) {
    return [];
  }
  
  try {
    // Create embeddings instance
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: apiKey,
      modelName: 'text-embedding-ada-002',
    });
    
    // Embed the query
    const queryVector = await embeddings.embedQuery(query);
    
    // Find most relevant documents
    const results: { score: number; content: string; fileName: string }[] = [];
    
    for (const doc of documentStore[apiKey]) {
      let maxSimilarity = -1;
      let bestChunk = '';
      
      // Find best matching chunk in this document
      for (let i = 0; i < doc.embeddings.length; i++) {
        const similarity = cosineSimilarity(queryVector, doc.embeddings[i]);
        if (similarity > maxSimilarity) {
          maxSimilarity = similarity;
          bestChunk = splitTextIntoChunks(doc.content, 1000)[i];
        }
      }
      
      results.push({
        score: maxSimilarity,
        content: bestChunk,
        fileName: doc.fileName
      });
    }
    
    // Sort by similarity and return top results
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(r => ({ content: r.content, fileName: r.fileName }));
  } catch (error) {
    console.error('Retrieval error:', error);
    return [];
  }
}

// Helper function to split text
function splitTextIntoChunks(text: string, chunkSize: number): string[] {
  const chunks: string[] = [];
  let currentChunk = '';
  
  const words = text.split(/\s+/);
  for (const word of words) {
    if ((currentChunk + word).length > chunkSize && currentChunk) {
      chunks.push(currentChunk);
      currentChunk = '';
    }
    currentChunk += (currentChunk ? ' ' : '') + word;
  }
  
  if (currentChunk) chunks.push(currentChunk);
  return chunks;
}

// Helper function to calculate cosine similarity
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] ** 2;
    normB += vecB[i] ** 2;
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}