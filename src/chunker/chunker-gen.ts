
// Helper for unique IDs
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export interface Chunk {
  uuid: string;

  // Location
  filePath: string;
  startLine: number;
  endLine: number;

  // Code
  code: string;
  parentCode?: string;

  // Structure
  breadcrumb?: string[]; 

  error?: string[]; 
  
  previousChunkSnippet?: string;
  nextChunkSnippet?: string;
}

export class GeneralChunker {
  private maxChunkSize: number;

  constructor(maxChunkSize: number = 1500) {
    this.maxChunkSize = maxChunkSize;
  }

  async chunk(filePath: string, code: string): Promise<Chunk[]> {
    const lines = code.split('\n');
    const chunks: Chunk[] = [];
    
    let currentChunkLines: string[] = [];
    let currentSize = 0;
    let startLine = 1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineSize = line.length + 1; // +1 for newline

      if (currentSize + lineSize > this.maxChunkSize && currentChunkLines.length > 0) {
        // Flatten current chunk
        this.emitChunk(currentChunkLines, filePath, startLine, i, chunks);
        
        // Reset for next
        // Overlap could be implemented here, but keeping it simple for now
        currentChunkLines = [];
        currentSize = 0;
        startLine = i + 1;
      }

      currentChunkLines.push(line);
      currentSize += lineSize;
    }

    if (currentChunkLines.length > 0) {
      this.emitChunk(currentChunkLines, filePath, startLine, lines.length, chunks);
    }
    
    // Enrich with snippets for navigation
    this.enrichChunks(chunks);

    return chunks;
  }

  private emitChunk(lines: string[], filePath: string, startLine: number, endLine: number, chunks: Chunk[]) {
      const code = lines.join('\n');
      chunks.push({
          uuid: uuidv4(),
          filePath,
          startLine,
          endLine,
          code,
          breadcrumb: ['text'], // Generic breadcrumb
      });
  }

  private enrichChunks(chunks: Chunk[]) {
    for (let i = 0; i < chunks.length; i++) {
        if (i > 0) {
            const prevLines = chunks[i-1].code.split('\n');
            chunks[i].previousChunkSnippet = prevLines.slice(-10).join('\n');
        }
        if (i < chunks.length - 1) {
            const nextLines = chunks[i+1].code.split('\n');
            chunks[i].nextChunkSnippet = nextLines.slice(0, 10).join('\n');
        }
    }
  }
}
