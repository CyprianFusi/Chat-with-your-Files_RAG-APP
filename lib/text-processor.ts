// lib/text-processor.ts

/**
 * Processes plain text files with various enhancements
 * @param text Raw text content
 * @returns Processed and normalized text
 */
export async function processText(text: string): Promise<string> {
  try {
    // 1. Normalize line breaks and whitespace
    let processed = text
      .replace(/\r\n/g, '\n')     // Convert Windows line endings
      .replace(/\r/g, '\n')       // Convert old Mac line endings
      .replace(/\t/g, '    ')     // Convert tabs to spaces
      .replace(/[ \t]+\n/g, '\n') // Remove trailing whitespace
      .replace(/\n{3,}/g, '\n\n') // Limit consecutive newlines
    
    // 2. Detect and handle common encoding issues
    if (processed.includes('�')) {
      // Attempt to fix common encoding problems
      processed = processed
        .replace(/â€“/g, '–')   // en dash
        .replace(/â€”/g, '—')   // em dash
        .replace(/â€˜/g, '‘')   // left single quote
        .replace(/â€™/g, '’')   // right single quote
        .replace(/â€œ/g, '“')   // left double quote
        .replace(/â€�/g, '”')   // right double quote
        .replace(/â€¢/g, '•')   // bullet
        .replace(/â€¦/g, '…')   // ellipsis
    }
    
    // 3. Remove non-printable characters except standard whitespace
    processed = processed.replace(/[^\x20-\x7E\n\t\r]/g, '')
    
    // 4. Handle common text artifacts
    processed = processed
      .replace(/(\w)-\n(\w)/g, '$1$2')  // Fix hyphenated words split across lines
      .replace(/([.!?]) +/g, '$1 ')      // Normalize space after punctuation
    
    // 5. Trim and return
    return processed.trim();
    
  } catch (error) {
    console.error('Text processing error:', error);
    // Return original text if processing fails
    return text;
  }
}