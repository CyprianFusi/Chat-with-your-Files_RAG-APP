/*
// Persistent document storage using localStorage
export function setUploadedText(sessionId: string, text: string) {
  if (typeof window === 'undefined') return;
  
  const storedData = localStorage.getItem('documents');
  const documents = storedData ? JSON.parse(storedData) : {};
  
  documents[sessionId] = text;
  localStorage.setItem('documents', JSON.stringify(documents));
  console.log(`Stored document for session: ${sessionId}`);
}

export function getUploadedText(sessionId: string): string | undefined {
  if (typeof window === 'undefined') return undefined;
  
  const storedData = localStorage.getItem('documents');
  if (!storedData) return undefined;
  
  const documents = JSON.parse(storedData);
  console.log(`Retrieving document for session: ${sessionId}`);
  console.log(`Available sessions: ${Object.keys(documents)}`);
  
  return documents[sessionId];
}

*/

// Enhanced version with error handling
export function setUploadedText(sessionId: string, text: string) {
  try {
    if (typeof window === 'undefined') return;
    
    const storedData = localStorage.getItem('documents');
    const documents = storedData ? JSON.parse(storedData) : {};
    
    documents[sessionId] = text;
    localStorage.setItem('documents', JSON.stringify(documents));
    console.log(`Stored document for session: ${sessionId}`);
  } catch (error) {
    console.error('Error saving document to localStorage:', error);
  }
}

export function getUploadedText(sessionId: string): string | undefined {
  try {
    if (typeof window === 'undefined') return undefined;
    
    const storedData = localStorage.getItem('documents');
    if (!storedData) return undefined;
    
    const documents = JSON.parse(storedData);
    return documents[sessionId];
  } catch (error) {
    console.error('Error reading document from localStorage:', error);
    return undefined;
  }
}