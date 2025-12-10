import { GenericChunker } from './chunker/GenericChunker';
import { Chunk, toTOON } from './chunker/types';
import * as fs from 'fs/promises';
import * as path from 'path';

async function main() {
  const chunker = new GenericChunker({
    maxChunkSize: 1000, // Small size to force splitting/merging
    minChunkSize: 50,
    overlap: 0
  });

  // Test on the chunker file itself
  const targetFile = path.resolve(process.cwd(), 'src/chunker/GenericChunker.ts');
  console.log(`Chunking file: ${targetFile}`);
  
  try {
    const code = await fs.readFile(targetFile, 'utf-8');
    const chunks = await chunker.chunk(code, 'typescript', targetFile);
    
    console.log(`Generated ${chunks.length} chunks.`);
    
    chunks.forEach((chunk, i) => {
        console.log(`\n--- Chunk ${i} [Sizes: ${chunk.content.length}] ---`);
        console.log(toTOON(chunk));
    });
    
  } catch (err) {
    console.error("Error chunking file:", err);
  }
}

main();
