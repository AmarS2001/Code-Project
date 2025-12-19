
import { SemanticChunker } from './chunker-sem';
import { GeneralChunker } from './chunker-gen';
import { getLanguageFromExtPromise } from './language-loader';
export type { Chunk } from './chunker-sem';

export class ChunkerManager {
  private semanticChunker: SemanticChunker;
  private generalChunker: GeneralChunker;

  constructor(maxChunkSize: number = 1500) {
    this.semanticChunker = new SemanticChunker(maxChunkSize);
    this.generalChunker = new GeneralChunker(maxChunkSize);
  }

  async chunk(filePath: string, code: string) {
    const ext = filePath.split('.').pop()?.toLowerCase();
    if (ext && getLanguageFromExtPromise[ext]) {
      try {
        const chunks = await this.semanticChunker.chunk(filePath, code);
        if (chunks.length > 0) {
            return chunks;
        }
      } catch (e) {
        console.warn(`Semantic chunking failed for ${filePath}, falling back to general chunker.`, e);
      }
    }
    return this.generalChunker.chunk(filePath, code);
  }
}
