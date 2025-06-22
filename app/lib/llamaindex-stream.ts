import { ReadableStream } from "web-streams-polyfill";

/**
 * Creates a streaming response from a LlamaIndex query engine.
 */
export async function createLlamaIndexStream(queryEngine: any, question: string): Promise<ReadableStream> {
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        const response = await queryEngine.query({ query: question });

        controller.enqueue(encoder.encode(response.response ?? ''));
        controller.close();
      } catch (err: any) {
        controller.enqueue(encoder.encode('Error: ' + (err?.message ?? 'Unknown error')));
        controller.close();
      }
    },
  });
}
