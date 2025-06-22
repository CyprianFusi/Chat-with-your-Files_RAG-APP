
export async function processCSV(text: string): Promise<string> {
  // Simple CSV to text conversion
  return text.split('\n').map(row => row.split(',').join(' | ')).join('\n');
}