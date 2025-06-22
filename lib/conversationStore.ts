const conversationMemory = new Map<string, { role: string; content: string }[]>();

export function getHistory(sessionId: string) {
  return conversationMemory.get(sessionId) || [];
}

export function appendToHistory(
  sessionId: string,
  messages: { role: string; content: string }[]
) {
  const existing = conversationMemory.get(sessionId) || [];
  const updated = [...existing, ...messages];
  conversationMemory.set(sessionId, updated);
  return updated;
}
