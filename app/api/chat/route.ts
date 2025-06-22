

import { NextRequest, NextResponse } from 'next/server';
import { VectorStoreIndex, storageContextFromDefaults, Settings } from 'llamaindex';
import { OpenAI, OpenAIEmbedding } from '@llamaindex/openai';
import path from 'path';
import type { NodeWithScore } from 'llamaindex';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const { question } = await req.json();
  
  try {
    // MUST SET EMBEDDING MODEL FIRST
    Settings.embedModel = new OpenAIEmbedding();
    
    const persistDir = path.join(process.cwd(), 'vector-store');
    const storageContext = await storageContextFromDefaults({ persistDir });
    const index = await VectorStoreIndex.init({ storageContext });
    
    Settings.llm = new OpenAI();
    const queryEngine = index.asQueryEngine();
    
    // Corrected property name: use 'stream' instead of 'streaming'
    const response = await queryEngine.query({
      query: question,
      stream: false  // Changed to 'stream'
    });
    
    // Extract sources from metadata
    const sources = (response?.sourceNodes || []).flatMap((node: NodeWithScore) => 
      node.node.metadata?.file ? [node.node.metadata.file] : []
    );

    return NextResponse.json({
      response: response.response,
      sources: [...new Set(sources)] // Remove duplicates
    });
  } catch (error: any) {
    console.error('Chat error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to process question' 
    }, { status: 500 });
  }
}